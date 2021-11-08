import log from '../logger';

const commands = {
  /**
   * @this {BaseDriver}
   * @param {DeviceSettings} newSettings
   * @returns {Promise<void>}
   */
  async updateSettings (newSettings) {
    if (!this.settings) {
      log.errorAndThrow('Cannot update settings; settings object not found');
    }
    return await this.settings.update(newSettings);
  },

  /**
   * @this {BaseDriver}
   * @returns {Promise<DeviceSettings>}
   */
  async getSettings () {
    if (!this.settings) {
      log.errorAndThrow('Cannot get settings; settings object not found');
    }
    return await this.settings.getSettings();
  }
};

export default commands;

/**
 * @typedef {import('../device-settings').DeviceSettings} DeviceSettings
 */

/**
 * @typedef {import('../driver').BaseDriver} BaseDriver
 */
