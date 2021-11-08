// @ts-check

import log from '../logger';
import { waitForCondition } from 'asyncbox';
import _ from 'lodash';
import { util } from '@appium/support';
import { errors } from '../../protocol';

const MIN_TIMEOUT = 0;

const commands = {
  /**
   *
   * @param {TimeoutType} type
   * @param {number} ms
   * @param {number} script
   * @param {number} pageLoad
   * @param {number} implicit
   * @returns
   */
  async timeouts (type, ms, script, pageLoad, implicit) {
    if (util.hasValue(type) && util.hasValue(ms)) {
      log.debug(`MJSONWP timeout arguments: ${JSON.stringify({type, ms})}}`);

      switch (type) {
        case 'command':
          await this.newCommandTimeout(ms);
          return;
        case 'implicit':
          await this.implicitWaitMJSONWP(ms);
          return;
        case 'page load':
          await this.pageLoadTimeoutMJSONWP(ms);
          return;
        case 'script':
          await this.scriptTimeoutMJSONWP(ms);
          return;
        default:
          throw new Error(`'${type}' type is not supported for MJSONWP timeout`);
      }
    }

    // Otherwise assume it is W3C protocol
    log.debug(`W3C timeout argument: ${JSON.stringify({script, pageLoad, implicit})}}`);
    if (util.hasValue(script)) {
      await this.scriptTimeoutW3C(script);
    }
    if (util.hasValue(pageLoad)) {
      await this.pageLoadTimeoutW3C(pageLoad);
    }
    if (util.hasValue(implicit)) {
      await this.implicitWaitW3C(implicit);
    }
  },

  /**
   *
   * @returns {Promise<{command: number, implicit: number}>}
   */
  async getTimeouts () { // eslint-disable-line require-await
    return {
      command: this.newCommandTimeoutMs,
      implicit: this.implicitWaitMs,
    };
  },

  /**
   *
   * @param {number} ms
   */
  async implicitWaitW3C (ms) {
    await this.implicitWait(ms);
  },

  /**
   *
   * @param {number} ms
   */
  async implicitWaitMJSONWP (ms) {
    await this.implicitWait(ms);
  },

  /**
   *
   * @param {number} ms
   */
  async implicitWait (ms) {
    await this.setImplicitWait(this.parseTimeoutArgument(ms));
  },

  /**
   *
   * @param {number} ms
   */
  setImplicitWait (ms) { // eslint-disable-line require-await
    this.implicitWaitMs = ms;
    log.debug(`Set implicit wait to ${ms}ms`);
    if (this.managedDrivers && this.managedDrivers.length) {
      log.debug('Setting implicit wait on managed drivers');
      for (let driver of this.managedDrivers) {
        if (_.isFunction(driver.setImplicitWait)) {
          driver.setImplicitWait(ms);
        }
      }
    }
  },

  /**
   * pageLoad
   * @param {number} ms
   */
  // eslint-disable-next-line no-unused-vars
  async pageLoadTimeoutW3C (ms) { // eslint-disable-line require-await
    throw new errors.NotImplementedError('Not implemented yet for pageLoad.');
  },

  /**
   *
   * @param {number} ms
   */
  // eslint-disable-next-line no-unused-vars
  async pageLoadTimeoutMJSONWP (ms) { // eslint-disable-line require-await
    throw new errors.NotImplementedError('Not implemented yet for pageLoad.');
  },

  /**
   * script
   * @param {number} ms
   */
  // eslint-disable-next-line no-unused-vars
  async scriptTimeoutW3C (ms) { // eslint-disable-line require-await
    throw new errors.NotImplementedError('Not implemented yet for script.');
  },

  /**
   *
   * @param {number} ms
   */
  // eslint-disable-next-line no-unused-vars
  async scriptTimeoutMJSONWP (ms) { // eslint-disable-line require-await
    throw new errors.NotImplementedError('Not implemented yet for script.');
  },

  /**
   * command
   * @param {number} ms
   */
  async newCommandTimeout (ms) { // eslint-disable-line require-await
    this.setNewCommandTimeout(this.parseTimeoutArgument(ms));
  }
};

/**
 * @this {BaseDriver}
 */
const helpers = {
  /**
   *
   * @param {number} ms
   */
  setNewCommandTimeout (ms) {
    this.newCommandTimeoutMs = ms;
    log.debug(`Set new command timeout to ${ms}ms`);
    if (this.managedDrivers && this.managedDrivers.length) {
      log.debug('Setting new command timeout on managed drivers');
      for (let driver of this.managedDrivers) {
        if (_.isFunction(driver.setNewCommandTimeout)) {
          driver.setNewCommandTimeout(ms);
        }
      }
    }
  },

  clearNewCommandTimeout () {
    if (this.noCommandTimer) {
      clearTimeout(this.noCommandTimer);
      this.noCommandTimer = null;
    }
  },

  startNewCommandTimeout () {
    // make sure there are no rogue timeouts
    this.clearNewCommandTimeout();

    // if command timeout is 0, it is disabled
    if (!this.newCommandTimeoutMs) return; // eslint-disable-line curly

    this.noCommandTimer = setTimeout(async () => {
      log.warn(`Shutting down because we waited ` +
                `${this.newCommandTimeoutMs / 1000.0} seconds for a command`);
      const errorMessage = `New Command Timeout of ` +
                `${this.newCommandTimeoutMs / 1000.0} seconds ` +
                `expired. Try customizing the timeout using the ` +
                `'newCommandTimeout' desired capability`;
      await this.startUnexpectedShutdown(new Error(errorMessage));
    }, this.newCommandTimeoutMs);
  },

  /**
   * @param {(...args: any[]) => any} condFn
   */
  async implicitWaitForCondition (condFn) {
    log.debug(`Waiting up to ${this.implicitWaitMs} ms for condition`);
    let wrappedCondFn = async (/** @type {any[]} */ ...args) => {
      // reset command timeout
      this.clearNewCommandTimeout();

      return await condFn(...args);
    };
    return await waitForCondition(wrappedCondFn, {
      waitMs: this.implicitWaitMs, intervalMs: 500, logger: log
    });
  },

  /**
   * @param {string} ms
   * @returns {number}
   */
  parseTimeoutArgument (ms) {
    let duration = parseInt(ms, 10);
    if (_.isNaN(duration) || duration < MIN_TIMEOUT) {
      throw new errors.UnknownError(`Invalid timeout value '${ms}'`);
    }
    return duration;
  }
};

const extensions = {...commands, ...helpers};
export { commands, helpers };
export default extensions;

