// @ts-check

import log from '../logger';
import {errors} from '../../protocol';

const commands = {
  async findElOrElsWithProcessing (strategy, selector, mult, context) {
    this.validateLocatorStrategy(strategy);
    try {
      return await this.findElOrEls(strategy, selector, mult, context);
    } catch (err) {
      if (this.opts.printPageSourceOnFindFailure) {
        const src = await this.getPageSource();
        log.debug(`Error finding element${mult ? 's' : ''}: ${err.message}`);
        log.debug(`Page source requested through 'printPageSourceOnFindFailure':`);
        log.debug(src);
      }
      // still want the error to occur
      throw err;
    }
  },

  async findElement (strategy, selector) {
    return await this.findElOrElsWithProcessing(strategy, selector, false);
  },

  async findElements (strategy, selector) {
    return await this.findElOrElsWithProcessing(strategy, selector, true);
  },

  async findElementFromElement (strategy, selector, elementId) {
    return await this.findElOrElsWithProcessing(strategy, selector, false, elementId);
  },

  async findElementsFromElement (strategy, selector, elementId) {
    return await this.findElOrElsWithProcessing(strategy, selector, true, elementId);
  },

  /**
   * Drivers must implement!
   * @this {import('../driver').BaseDriver}
   * @abstract
   * @param {string} strategy - Locator strategy
   * @param {string} selector - Actual selector
   * @param {boolean} mult - Multiple elements or just one?
   * @param {object} context - Finding from an element, or from root?
   * @returns {Promise<object>} - Returns an object which adheres to the way the JSON Wire Protocol represents elements; eg: `{ ELEMENT: 3 }` or `{ ELEMENT: 1.023 }`
   */
  // eslint-disable-next-line require-await, no-unused-vars
  async funcElOrEls (strategy, selector, mult, context) {
    throw new errors.NotYetImplementedError();
  }
};

export default commands;
