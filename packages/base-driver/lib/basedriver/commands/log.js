// @ts-check

import log from '../logger';
import _ from 'lodash';

/**
 * Override in subclasses
 * @type {Record<string,LogType>}
 * @example
 *  {
 *    type: {
 *      description: 'some useful text',
 *      getter: () => {}, // some function that will be called to get the logs
 *    }
 *  }
 */
const supportedLogTypes = {};

const commands = {
  /**
   * @this {BaseDriver}
   * @returns {Promise<string[]>}
   */
  // eslint-disable-next-line require-await
  async getLogTypes () {
    log.debug('Retrieving supported log types');
    return _.keys(this.supportedLogTypes);
  },

  /**
   * @param {keyof typeof supportedLogTypes} logType
   * @this {BaseDriver}
   */
  async getLog (logType) {
    log.debug(`Retrieving '${logType}' logs`);

    if (!(await this.getLogTypes()).includes(logType)) {
      const logsTypesWithDescriptions = _.reduce(
        this.supportedLogTypes,
        (acc, value, key) => {
          acc[key] = value.description;
          return acc;
        },
        {},
      );
      throw new Error(
        `Unsupported log type '${logType}'. ` +
          `Supported types: ${JSON.stringify(logsTypesWithDescriptions)}`,
      );
    }

    return await this.supportedLogTypes[logType].getter(this);
  },
};

const helpers = {};

const extensions = {...commands, ...helpers, supportedLogTypes};

export default extensions;

/**
 * @typedef {import('../driver').BaseDriver} BaseDriver
 */
