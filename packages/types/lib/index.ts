import type {Method as _Method} from 'axios';
import type {Server} from 'http';
import type {Class as _Class, MultidimensionalReadonlyArray} from 'type-fest';
import {ServerArgs} from './config';
import {Capabilities, W3CCapabilities} from './capabilities';
import {Express} from 'express';
import {ExternalDriver} from './driver';

export * from './driver';
export * from './plugin';
export {AppiumW3CCapabilities} from './capabilities';
export {AppiumConfig, NormalizedAppiumConfig} from './config';
export * from './appium-config';
export {ServerArgs, Capabilities, W3CCapabilities};

export type AppiumServer = Omit<Server, 'close'> & {
  close: () => Promise<void>;
};

export interface Method<T> {
  command?: keyof T; // T[keyof T] needs to return a Promise.
  neverProxy?: boolean;
  payloadParams?: PayloadParams;
}
export interface PayloadParams {
  wrap?: string;
  unwrap?: string;
  required?: Readonly<string[]> | MultidimensionalReadonlyArray<string, 2>;
  optional?: Readonly<string[]> | MultidimensionalReadonlyArray<string, 2>;
  validate?: (obj: any, protocol: string) => boolean | string | undefined;
  makeArgs?: (obj: any) => any;
}

export type MethodMap<Extension = ExternalDriver> = Record<
  string,
  Record<string, Method<Extension & ExternalDriver>>
>;

/**
 * Wraps {@linkcode _Class `type-fest`'s `Class`} to include static members.
 */
export type Class<
  Proto,
  StaticMembers extends object = {},
  Args extends unknown[] = any[]
> = _Class<Proto, Args> & StaticMembers;
/**
 * The string referring to a "driver"-type extension
 */
export type DriverType = 'driver';
/**
 * The string referring to a "plugin"-type extension
 *
 */
export type PluginType = 'plugin';
/**
 * The strings referring to all extension types.
 */
export type ExtensionType = DriverType | PluginType;

export type UpdateServerCallback = (
  expressApp: Express,
  httpServer: AppiumServer
) => Promise<void>;
