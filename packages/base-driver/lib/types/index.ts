import type { BaseDriverBase } from '../basedriver/driver';
import {
  DriverType,
  ExtensionType,
  PluginType,
  Class,
  Driver,
  ExternalDriver,
} from '@appium/types';

export type DriverClass = BaseDriverBase<ExternalDriver, ExternalDriverStatic>;

/**
 * Additional static props for external driver classes
 */
interface ExternalDriverStatic {
  driverName: string;
}

/**
 * TODO: This should be derived from the base plugin.
 */
export type PluginClass = Class<PluginProto, ExternalPluginStatic>;

/**
 * Static props for plugin classes
 */
interface ExternalPluginStatic {
  pluginName: string;
}

/**
 * A plugin must have this shape.
 * @todo Use base plugin instead of this
 */
export interface PluginProto {
  /**
   * I'm not sure why `plugin.name` is required, but it is.
   */
  name: string;
  /**
   * Assigned by Appium; _not_ provided by implementor.
   */
  cliArgs?: Record<string, any>;
  /**
   * Don't know what this is, but it's also required.
   */
  onUnexpectedShutdown?: (
    driver: Driver,
    cause: Error | string,
  ) => Promise<void>;
}

/**
 * Generic to get at the class of an extension.
 */
export type ExtClass<ExtType extends ExtensionType> = ExtType extends DriverType
  ? DriverClass
  : ExtType extends PluginType
  ? PluginClass
  : never;
