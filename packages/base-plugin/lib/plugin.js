import {logger} from 'appium/support';

/**
 * @implements {Plugin}
 */
class BasePlugin {
  static newMethodMap = {};

  /** @type {Plugin['cliArgs']} */
  cliArgs;

  /**
   * @param {string} pluginName
   */
  constructor(pluginName) {
    this.name = pluginName;
    this.logger = logger.getLogger(`Plugin [${pluginName}]`);
  }

  /**
   * Optionally updates an Appium express app and http server, by calling methods that may mutate
   * those objects. For example, you could call:
   *
   * `expressApp.get('/foo', handler)`
   *
   * In order to add a new route to Appium with this plugin. Or, you could add new listeners to the
   * httpServer object.
   *
   * @param {import('express').Express} expressApp - the Express 'app' object used by Appium for route handling
   * @param {import('@appium/types').AppiumServer} httpServer - the node HTTP server that hosts the app
   */
  // eslint-disable-next-line no-unused-vars
  static async updateServer(expressApp, httpServer) {}

  /**
   * You could also handle all commands generically by implementing 'handle'
   * @param {import('@appium/types').NextPluginCallback} next
   * @param {import('@appium/types').Driver} driver
   * @param {string} cmdName
   * @param {...any} args
   */
  // eslint-disable-next-line no-unused-vars
  async handle(next, driver, cmdName, ...args) {
    return await next();
  }
}

export default BasePlugin;
export {BasePlugin};

/**
 * @typedef {import('@appium/types').Plugin} Plugin
 */
