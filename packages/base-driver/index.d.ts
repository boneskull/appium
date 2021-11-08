import {BaseDriver as Driver} from './lib/basedriver/driver';
import {ParsedArgs} from '../appium/types/types';

declare global {
  type OnSettingsUpdateListener = (
    prop: string,
    newValue: object,
    curValue: object,
  ) => Promise<void> | void;

  // class BlaseDriver {
  //   // class variables
  //   static baseVersion: string;

  //   // getters/setters
  //   get driverData(): {};
  //   get isCommandsQueueEnabled(): boolean;
  //   get eventHistory(): {};
  //   get desiredCapConstraints(): Constraints;

  //   set desiredCapConstraints(constraints: Constraints);

  //   // non-command methods
  //   onUnexpectedShutdown(handler: () => any): void;
  //   executeCommand(cmd: string, ...args: any[]): Promise<any>;
  //   startUnexpectedShutdown(err?: Error): Promise<void>;
  //   validateLocatorStrategy(strategy: string, webContext?: boolean): void;
  //   proxyActive(): boolean;
  //   getProxyAvoidList(): [string, RegExp][];
  //   canProxy(): boolean;
  //   proxyRouteIsAvoided(sessionId: string, method: string, url: string): boolean;
  //   addManagedDriver(driver: BlaseDriver): void;
  //   getManagedDrivers(): BlaseDriver[];
  //   clearNewCommandTimeout(): Promise<void>;
  //   startNewCommandTimeout(): Promise<void>;
  //   implicitWaitForCondition(condition: () => Promise<any>): Promise<unknown>;

  //   // Commands
  //   findElOrEls(
  //     strategy: string,
  //     selector: string,
  //     mult: boolean,
  //     context: string,
  //   ): Promise<Element | Element[]>;
  //   newCommandTimeout(ms: number): Promise<void>;
  //   getLogTypes(): Promise<string[]>;
  //   getLog(logType: string): Promise<{}[]>;

  //   // WebDriver
  //   createSession(
  //     jwpCaps: {},
  //     jwpReqCaps: {},
  //     w3cCaps: {},
  //   ): Promise<[string, {}]>;
  //   deleteSession(): Promise<void>;
  //   getSessions(): Promise<{id: string; capabilities: {}}[]>;
  //   getSession(): Promise<{}>;
  //   getTimeouts(): Promise<Record<string, number>>;
  //   timeouts(
  //     type: string,
  //     ms: number,
  //     script: number,
  //     pageLoad: number,
  //     implicit: number,
  //   ): Promise<void>;
  //   setUrl?(url: string): Promise<void>;
  //   getUrl?(): Promise<string>;
  //   back?(): Promise<void>;
  //   forward?(): Promise<void>;
  //   refresh?(): Promise<void>;
  //   title?(): Promise<string>;
  //   getWindowHandle?(): Promise<string>;
  //   closeWindow?(): Promise<string[]>;
  //   setWindow?(handle: string): Promise<void>;
  //   getWindowHandles?(): Promise<string[]>;
  //   setFrame?(id: null | number | string): Promise<void>;
  //   getWindowRect?(): Promise<Rect>;
  //   setWindowRect?(
  //     x: number,
  //     y: number,
  //     width: number,
  //     height: number,
  //   ): Promise<Rect>;
  //   maximizeWindow?(): Promise<Rect>;
  //   minimizeWindow?(): Promise<Rect>;
  //   fullScreenWindow?(): Promise<Rect>;
  //   active?(): Promise<Element>;
  //   findElement(strategy: string, selector: string): Promise<Element>;
  //   findElements(strategy: string, selector: string): Promise<Element[]>;
  //   findElementFromElement(
  //     strategy: string,
  //     selector: string,
  //     elementId: string,
  //   ): Promise<Element>;
  //   findElementsFromElement(
  //     strategy: string,
  //     selector: string,
  //     elementId: string,
  //   ): Promise<Element[]>;
  //   elementSelected?(elementId: string): Promise<boolean>;
  //   getAttribute?(name: string, elementId: string): Promise<string | null>;
  //   getProperty?(name: string, elementId: string): Promise<string | null>;
  //   getCssProperty?(name: string, elementId: string): Promise<string>;
  //   getText?(elementId: string): Promise<string>;
  //   getName?(elementId: string): Promise<string>;
  //   getElementRect?(elementId: string): Promise<Rect>;
  //   elementEnabled?(elementId: string): Promise<boolean>;
  //   elementDisplayed?(elementId: string): Promise<boolean>;
  //   click?(elementId: string): Promise<void>;
  //   clear?(elementId: string): Promise<void>;
  //   setValue?(text: string, elementId: string): Promise<void>;
  //   getPageSource?(): Promise<string>;
  //   execute?(script: string, args: unknown[]): Promise<unknown>;
  //   executeAsync?(script: string, args: unknown[]): Promise<unknown>;
  //   getCookies?(): Promise<Cookie[]>;
  //   getCookie?(name: string): Promise<Cookie>;
  //   setCookie?(cookie: Cookie): Promise<void>;
  //   deleteCookie?(name: string): Promise<void>;
  //   deleteCookies?(): Promise<void>;
  //   performActions?(actions: Actions[]): Promise<void>;
  //   releaseActions?(): Promise<void>;
  //   postDismissAlert?(): Promise<void>;
  //   postAcceptAlert?(): Promise<void>;
  //   getAlertText?(): Promise<string | null>;
  //   setAlertText?(text: string): Promise<void>;
  //   getScreenshot?(): Promise<string>;
  //   getElementScreenshot?(elementId: string): Promise<string>;

  //   // Appium W3C WebDriver Extension
  //   mobileShake?(): Promise<void>;
  //   getDeviceTime?(format?: string): Promise<string>;
  //   lock?(seconds?: number): Promise<void>;
  //   unlock?(): Promise<void>;
  //   isLocked?(): Promise<boolean>;
  //   startRecordingScreen?(options?: ScreenRecordOptions): Promise<void>;
  //   stopRecordingScreen?(options?: ScreenRecordOptions): Promise<string>;
  //   getPerformanceDataTypes?(): Promise<string[]>;
  //   getPerformanceData?(
  //     packageName: string,
  //     dataType: string,
  //     dataReadTimeout?: number,
  //   ): Promise<string[]>;
  //   pressKeyCode?(
  //     keycode: number,
  //     metastate?: number,
  //     flags?: number,
  //   ): Promise<void>;
  //   longPressKeyCode?(
  //     keycode: number,
  //     metastate?: number,
  //     flags?: number,
  //   ): Promise<void>;
  //   fingerprint?(fingerprintId: number): Promise<void>;
  //   sendSMS?(phoneNumber: string, message: string): Promise<void>;
  //   gsmCall?(phoneNumber: string, action: string): Promise<void>;
  //   gsmSignal?(signalStrength: string): Promise<void>;
  //   gsmVoice?(state: string): Promise<void>;
  //   powerCapacity?(percent: number): Promise<void>;
  //   powerAC?(state: string): Promise<void>;
  //   networkSpeed?(netspeed: string): Promise<void>;
  //   keyevent?(keycode: string, metastate?: string): Promise<void>;
  //   mobileRotation?(
  //     x: number,
  //     y: number,
  //     radius: number,
  //     rotation: number,
  //     touchCount: number,
  //     duration: string,
  //     elementId?: string,
  //   ): Promise<void>;
  //   getCurrentActivity?(): Promise<string>;
  //   getCurrentPackage?(): Promise<string>;
  //   installApp?(appPath: string, options?: unknown): Promise<void>;
  //   activateApp?(appId: string, options?: unknown): Promise<void>;
  //   removeApp?(appId: string, options?: unknown): Promise<void>;
  //   terminateApp?(appId: string, options?: unknown): Promise<void>;
  //   isAppInstalled?(appId: string): Promise<boolean>;
  //   queryAppState?(appId: string): Promise<number>;
  //   hideKeyboard?(
  //     strategy?: string,
  //     key?: string,
  //     keyCode?: string,
  //     keyName?: string,
  //   ): Promise<void>;
  //   isKeyboardShown?(): Promise<boolean>;
  //   pushFile?(path: string, data: string): Promise<void>;
  //   pullFile?(path: string): Promise<string>;
  //   pullFolder?(path: string): Promise<string>;
  //   toggleFlightMode?(): Promise<void>;
  //   toggleData?(): Promise<void>;
  //   toggleWiFi?(): Promise<void>;
  //   toggleLocationServices?(): Promise<void>;
  //   openNotifications?(): Promise<void>;
  //   startActivity?(
  //     appPackage: string,
  //     appActivity: string,
  //     appWaitPackage?: string,
  //     appWaitActivity?: string,
  //     intentAction?: string,
  //     intentCategory?: string,
  //     intentFlags?: string,
  //     optionalIntentArguments?: string,
  //     dontStopAppOnReset?: boolean,
  //   ): Promise<void>;
  //   getSystemBars?(): Promise<unknown[]>;
  //   getDisplayDensity?(): Promise<number>;
  //   touchId?(match: boolean): Promise<void>;
  //   toggleEnrollTouchId?(enabled: boolean): Promise<void>;
  //   launchApp?(): Promise<void>;
  //   closeApp?(): Promise<void>;
  //   reset(): Promise<void>;
  //   background?(seconds: null | number): Promise<void>;
  //   endCoverage?(intent: string, path: string): Promise<void>;
  //   getStrings?(
  //     language?: string,
  //     stringFile?: string,
  //   ): Promise<Record<string, unknown>>;
  //   setValueImmediate?(value: string, elementId: string): Promise<void>;
  //   replaceValue?(value: string, elementId: string): Promise<void>;
  //   updateSettings(newSettings: Record<string, unknown>): Promise<void>;
  //   getSettings(): Promise<Record<string, unknown>>;
  //   receiveAsyncResponse?(response: unknown): Promise<void>;
  //   executeDriverScript(
  //     script: string,
  //     scriptType?: string,
  //     timeout?: number,
  //   ): Promise<unknown>;
  //   getLogEvents(type?: string | string[]): {};
  //   logCustomEvent(vendor: string, event: string): void;
  //   setClipboard?(
  //     content: string,
  //     contentType?: string,
  //     label?: string,
  //   ): Promise<void>;
  //   getClipboard?(contentType?: string): Promise<string>;

  //   // JSONWP
  //   asyncScriptTimeout?(ms: number): Promise<void>;
  //   implicitWait(ms: number): Promise<void>;
  //   getWindowSize?(): Promise<Size>;
  //   getLocation?(elementId: string): Promise<Position>;
  //   getLocationInView?(elementId: string): Promise<Position>;
  //   getSize?(elementId: string): Promise<Size>;
  //   equalsElement?(elementId: string, otherElementId: string): Promise<boolean>;
  //   submit?(elementId: string): Promise<void>;
  //   keys?(value: string[]): Promise<void>;
  //   availableIMEEngines?(): Promise<string[]>;
  //   getActiveIMEEngine?(): Promise<string>;
  //   isIMEActivated?(): Promise<boolean>;
  //   deactivateIMEEngine?(): Promise<void>;
  //   activateIMEEngine?(engine: string): Promise<void>;
  //   getOrientation?(): Promise<string>;
  //   setOrientation?(orientation: string): Promise<void>;
  //   moveTo?(
  //     element?: null | string,
  //     xOffset?: number,
  //     yOffset?: number,
  //   ): Promise<void>;
  //   buttonDown?(button?: number): Promise<void>;
  //   buttonUp?(button?: number): Promise<void>;
  //   clickCurrent?(button?: number): Promise<void>;
  //   doubleClick?(): Promise<void>;
  //   touchDown?(x: number, y: number): Promise<void>;
  //   touchUp?(x: number, y: number): Promise<void>;
  //   touchMove?(x: number, y: number): Promise<void>;
  //   touchLongClick?(elementId: string): Promise<void>;
  //   flick?(
  //     element?: string,
  //     xSpeed?: number,
  //     ySpeed?: number,
  //     xOffset?: number,
  //     yOffset?: number,
  //     speed?: number,
  //   ): Promise<void>;
  //   getGeoLocation?(): Promise<Location>;
  //   setGeoLocation?(location: Partial<Location>): Promise<void>;

  //   // MJSONWIRE
  //   getCurrentContext?(): Promise<string | null>;
  //   setContext?(name: string): Promise<void>;
  //   getContexts?(): Promise<string[]>;
  //   getPageIndex?(elementId: string): Promise<string>;
  //   getNetworkConnection?(): Promise<number>;
  //   setNetworkConnection?(type: number): Promise<void>;
  //   performTouch?(actions: unknown): Promise<void>;
  //   performMultiAction?(actions: unknown, elementId: string): Promise<void>;
  //   getRotation?(): Promise<Rotation>;
  //   setRotation?(x: number, y: number, z: number): Promise<void>;

  //   // Chromium DevTools
  //   executeCdp?(cmd: string, params: unknown): Promise<unknown>;

  //   // Web Authentication
  //   addVirtualAuthenticator?(
  //     protocol: string,
  //     transport: string,
  //     hasResidentKey?: boolean,
  //     hasUserVerification?: boolean,
  //     isUserConsenting?: boolean,
  //     isUserVerified?: boolean,
  //   ): Promise<void>;
  //   removeVirtualAuthenticator?(): Promise<void>;
  //   addAuthCredential?(
  //     credentialId: string,
  //     isResidentCredential: boolean,
  //     rpId: string,
  //     privateKey: string,
  //     userHandle?: string,
  //     signCount?: number,
  //   ): Promise<void>;
  //   getAuthCredential?(): Promise<Credential[]>;
  //   removeAllAuthCredentials?(): Promise<void>;
  //   removeAuthCredential?(): Promise<void>;
  //   setUserAuthVerified?(isUserVerified: boolean): Promise<void>;
  // }

  type Constraints = {
    [key: string]: {
      presence?: boolean;
      isString?: boolean;
      isNumber?: boolean;
      isBoolean?: boolean;
      isObject?: boolean;
      isArray?: boolean;
      deprecated?: boolean;
      inclusion?: any[];
    };
  };

  type WebElement = {
    'element-6066-11e4-a52e-4f735466cecf': string;
  };

  type LogType = {
    description: string;
    getter: (driver: BaseDriver) => Promise<{}[]>;
  };

  // WebDriver

  interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  interface Cookie {
    name: string;
    value: string;
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    expiry?: number;
    sameSite?: 'Lax' | 'Strict';
  }

  interface Actions {
    type?: string;
    actions: Action[];
    parameters?: {
      pointerType?: string;
    };
  }

  interface Action {
    type: string;
    duration?: number;
    value?: string;
    x?: number;
    y?: number;
    button?: number;
    origin?: string;
  }

  // Appium W3C WebDriver Extension
  interface ScreenRecordOptions {
    remotePath?: string;
    username?: string;
    password?: string;
    method?: string;
    forceRestart?: boolean;
    timeLimit?: string;
    videoType?: string;
    videoQuality?: string;
    videoFps?: string;
    videoScale?: string;
    bitRate?: string;
    videoSize?: string;
    bugReport?: string;
  }

  // JSONWP

  type Size = Pick<Rect, 'width' | 'height'>;

  type Position = Pick<Rect, 'x' | 'y'>;

  interface Location {
    latitude: number;
    longitude: number;
    altitude: number;
  }

  interface Rotation {
    x: number;
    y: number;
    z: number;
  }

  // Web Authentication

  interface Credential {
    credentialId: string;
    isResidentCredential: boolean;
    rpId: string;
    privateKey: string;
    userHandle: string | undefined;
    signCount: number;
    largeBlob: string | undefined;
  }

  interface MethodMap<Args extends any[]> {
    [path: string]: {
      [method: string]: {
        command: string;
        neverProxy: boolean;
        payloadParams: {
          wrap: string;
          unwrap: string;
          required: string[] | string[][];
          optional: string[] | string[][];
          validate: (
            obj: object,
            protocol: string,
          ) => string | false | null | undefined;
          makeArgs: (obj: object, protocol: string) => Args;
        };
      };
    };
  }

  interface EventHistory {
    commands: EventHistoryCommand[];
  }

  interface EventHistoryCommand {
    cmd: BaseCommand;
    startTime: number;
    endTime: number;
  }

  type FunctionProps<Driver> = {
    [Prop in keyof Driver]: Driver[Prop] extends Function ? Prop : never;
  }[keyof Driver];

  type Command<D extends typeof Driver = typeof Driver> = FunctionProps<D>;

  type BaseCommand = Command<typeof Driver>;

  type DriverOpts = Partial<ParsedArgs>;

  type TimeoutType = 'command' | 'implicit' | 'page load' | 'script';

  type Capabilities = Record<string, any>;

  type BaseDriver = Driver;
}
