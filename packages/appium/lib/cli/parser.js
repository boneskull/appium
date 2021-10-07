import {fs} from '@appium/support';
import {ArgumentParser} from 'argparse';
import B from 'bluebird';
import _ from 'lodash';
import path from 'path';
import {DRIVER_TYPE, PLUGIN_TYPE} from '../extension-config';
import {finalizeSchema} from '../schema';
import {parseArgName} from './schema-args';
import {rootDir} from '../utils';
import {
  driverConfig,
  getExtensionArgs,
  getServerArgs,
  pluginConfig,
} from './args';
import {handle, CLIError} from '@oclif/errors';

const version = fs.readPackageJsonFrom(rootDir).version;

/**
 * A wrapper around `argparse`
 *
 * - Handles instantiation, configuration, and monkeypatching of an
 *    `ArgumentParser` instance for Appium server and its extensions
 * - Handles error conditions, messages, and exit behavior
 */
class ArgParser {
  constructor (debug = false) {
    const prog = (this.prog = process.argv[1]
      ? path.basename(process.argv[1])
      : 'appium');
    const parser = new ArgumentParser({
      add_help: true,
      description:
        'A webdriver-compatible server for use with native and hybrid iOS and Android applications.',
      prog,
      exit_on_error: false,
    });

    ArgParser._patchExit(parser);

    this.debug = debug;

    this.parser = parser;

    parser.add_argument('-v', '--version', {
      action: 'version',
      version,
    });

    const subParsers = parser.add_subparsers({dest: 'subcommand'});

    // add the 'server' subcommand, and store the raw arguments on the parser
    // object as a way for other parts of the code to work with the arguments
    // conceptually rather than just through argparse
    const serverArgs = ArgParser._addServerToParser(subParsers, debug);
    this.rawArgs = serverArgs;

    // add the 'driver' and 'plugin' subcommands
    ArgParser._addExtensionCommandsToParser(subParsers, debug);

    // backwards compatibility / drop-in wrapper
    this.parse_args = this.parseArgs;
  }

  /**
   * Parse arguments from the command line.
   *
   * If no subcommand is passed in, this method will inject the `server` subcommand.
   *
   * `ArgParser.prototype.parse_args` is an alias of this method.
   * @param {string[]} [args] - Array of arguments, ostensibly from `process.argv`. Gathers args from `process.argv` if not provided.
   * @returns {object} - The parsed arguments
   */
  parseArgs (args) {
    args = args ?? process.argv.slice(2);

    if (
      !_.includes(
        [DRIVER_TYPE, PLUGIN_TYPE, 'server', '-h', '--help', '-v', '--version'],
        args[0],
      )
    ) {
      args.splice(0, 0, 'server');
    }

    try {
      return ArgParser._unpackExtensionArgDests(this.parser.parse_args(args));
    } catch (err) {
      if (this.debug) {
        throw err;
      }
      // eslint-disable-next-line no-console
      console.error(); // need an extra space since argparse prints usage.
      const cliError = new CLIError(err, {exit: 1});
      // we could add an error code here which would be displayed to the user
      // cliError.code = 'APPIUM_BAD_ARGUMENT';
      // or a hyperlink
      // cliError.ref = 'https://appium.io/docs/cli#usage'
      handle(cliError);
    }
  }

  /**
   * Given an object full of arguments as returned by `argparser.parse_args`,
   * expand the ones for extensions into a nested object structure.
   *
   * E.g., `{'driver-foo-bar': baz}` becomes `{driver: {foo: {bar: 'baz'}}}`
   * @param {object} args
   * @returns {object}
   */
  static _unpackExtensionArgDests (args) {
    return _.reduce(
      args,
      (unpacked, value, key) => {
        const {extensionName, extensionType, argName} = parseArgName(key);
        const keyPath =
          extensionName && extensionType
            ? `${extensionType}.${extensionName}.${argName}`
            : argName;
        _.set(unpacked, keyPath, value);
        return unpacked;
      },
      {},
    );
  }

  static _patchExit (parser) {
    parser.exit = (code, msg) => {
      throw new Error(msg);
    };
  }

  static _addServerToParser (subParsers) {
    const serverParser = subParsers.add_parser('server', {
      add_help: true,
      help: 'Run an Appium server',
    });

    ArgParser._patchExit(serverParser);

    const serverArgs = getServerArgs();
    for (const [flagsOrNames, opts] of serverArgs) {
      // add_argument mutates arguments so make copies
      serverParser.add_argument(...flagsOrNames, {...opts});
    }

    return serverArgs;
  }

  static _addExtensionCommandsToParser (subParsers) {
    for (const type of [DRIVER_TYPE, PLUGIN_TYPE]) {
      const extParser = subParsers.add_parser(type, {
        add_help: true,
        help: `Access the ${type} management CLI commands`,
      });

      ArgParser._patchExit(extParser);

      const extSubParsers = extParser.add_subparsers({
        dest: `${type}Command`,
      });
      const extensionArgs = getExtensionArgs();
      const parserSpecs = [
        {
          command: 'list',
          args: extensionArgs[type].list,
          help: `List available and installed ${type}s`,
        },
        {
          command: 'install',
          args: extensionArgs[type].install,
          help: `Install a ${type}`,
        },
        {
          command: 'uninstall',
          args: extensionArgs[type].uninstall,
          help: `Uninstall a ${type}`,
        },
        {
          command: 'update',
          args: extensionArgs[type].update,
          help: `Update installed ${type}s to the latest version`,
        },
        {
          command: 'run',
          args: extensionArgs[type].run,
          help:
            `Run a script (defined inside the ${type}'s package.json under the ` +
            `“scripts” field inside the “appium” field) from an installed ${type}`,
        },
      ];

      for (const {command, args, help} of parserSpecs) {
        const parser = extSubParsers.add_parser(command, {help});

        ArgParser._patchExit(parser);

        for (const [flagsOrNames, opts] of args) {
          // add_argument mutates params so make sure to send in copies instead
          parser.add_argument(...flagsOrNames, {...opts});
        }
      }
    }
  }
}

/**
 * Creates a {@link ArgParser} instance.  Necessarily reads extension configuration
 * beforehand, and finalizes the config schema.
 *
 * @constructs ArgParser
 * @param {boolean} [debug] - If `true`, throw instead of exit upon parsing error
 * @returns {Promise<ArgParser>}
 */
async function getParser (debug = false) {
  await B.all([driverConfig.read(), pluginConfig.read()]);
  finalizeSchema();

  return new ArgParser(debug);
}

export default getParser;
export {getParser, ArgParser};
