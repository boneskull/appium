export {};

import * as types from './index';
import {
  DriverType as _DriverType,
  PluginType as _PluginType,
  ExtensionType as _ExtensionType,
} from '@appium/types';

/**
 * Commonly-used global types.
 * 
 * Give me convenience or give me death!!
 */
declare global {
  type DriverType = _DriverType;
  type PluginType = _PluginType;
  type ExtensionType = _ExtensionType;
  type ExtManifestWithSchema<ExtType extends ExtensionType> =
    types.ExtManifestWithSchema<ExtType>;
  type ExtManifest<ExtType extends ExtensionType> = types.ExtManifest<ExtType>;
  type ExtRecord<ExtType extends ExtensionType> = types.ExtRecord<ExtType>;
  
  type ExtName<ExtType extends ExtensionType> = types.ExtName<ExtType>;
  type ExtMetadata<ExtType extends ExtensionType> = types.ExtMetadata<ExtType>;
  type ManifestData = types.ManifestData;
  type InternalMetadata = types.InternalMetadata;
  type ExtPackageJson<ExtType extends ExtensionType> = types.ExtPackageJson<ExtType>
  type CommonMetadata = types.CommonMetadata;
}
