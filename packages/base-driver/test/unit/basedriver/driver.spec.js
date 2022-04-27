// transpile:mocha

import BaseDriver from '../../../lib';
import {baseDriverUnitTests} from 'appium/test';

baseDriverUnitTests(BaseDriver, {
  platformName: 'iOS',
  'appium:deviceName': 'Delorean',
});
