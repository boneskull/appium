import _ from 'lodash';
import {
  BaseDriver,
  server,
  routeConfiguringFunction,
  DeviceSettings,
  PREFIXED_APPIUM_OPTS_CAP,
} from 'appium/driver';
import axios from 'axios';
import B from 'bluebird';
import {TEST_HOST, getTestPort, createAppiumURL} from './helpers';
import chai from 'chai';
import sinon from 'sinon';

const should = chai.should();
const {expect} = chai;

/**
 * Creates E2E test suites for a driver.
 * @template {import('@appium/types').Driver} P
 * @template {import('@appium/types').DriverStatic} S
 * @param {DriverClass<P,S>} DriverClass
 * @param {import('@appium/types').AppiumW3CCapabilities} [defaultCaps]
 */
export function baseDriverE2ETests(DriverClass, defaultCaps = {}) {
  let address = defaultCaps['appium:address'] ?? TEST_HOST;
  let port = defaultCaps['appium:port'];
  const className = DriverClass.name || '(unknown driver)';

  describe(`BaseDriver E2E (as ${className})`, function () {
    let baseServer;
    /** @type {P} */
    let d;
    /**
     * This URL creates a new session
     * @type {string}
     **/
    let newSessionURL;

    /**
     * Creates a URL with base host/port. Supply `session` and `pathname`
     * @type {import('lodash').CurriedFunction2<string?,string,string>}
     */
    let createAppiumTestURL;

    /**
     * Creates a URL with the given session ID and a blank pathname;
     * e.g., `http://foo.bar:123/session/<session-id>`
     *  @type {import('lodash').CurriedFunction1<string?,string>}
     */
    let createSessionURL;

    before(async function () {
      port = port ?? (await getTestPort());
      defaultCaps = {...defaultCaps, 'appium:port': port};
      d = new DriverClass({port, address});
      baseServer = await server({
        routeConfiguringFunction: routeConfiguringFunction(d),
        port,
        hostname: TEST_HOST,
      });
      createAppiumTestURL =
        /** @type {import('lodash').CurriedFunction2<string,string,string>} */ (
          createAppiumURL(address, port)
        );
      newSessionURL = createAppiumTestURL('', 'session');
      createSessionURL = createAppiumTestURL(_, '');
    });

    after(async function () {
      await baseServer.close();
    });

    async function startSession(caps) {
      return (
        await axios.post(newSessionURL, {
          data: {
            capabilities: {
              alwaysMatch: caps,
              firstMatch: [{}],
            },
          },
        })
      ).data.value;
    }

    async function endSession(id) {
      return (
        await axios.delete(createSessionURL(id), {
          validateStatus: null,
        })
      ).data.value;
    }

    async function getSession(id) {
      return (
        await axios({
          url: createSessionURL(id),
        })
      ).data.value;
    }

    describe('session handling', function () {
      it('should handle idempotency while creating sessions', async function () {
        const sessionIds = [];
        let times = 0;
        do {
          const {sessionId} = (
            await axios.post(newSessionURL, {
              headers: {
                'X-Idempotency-Key': '123456',
              },
              data: {
                capabilities: {alwaysMatch: defaultCaps, firstMatch: [{}]},
              },
              simple: false,
              resolveWithFullResponse: true,
            })
          ).data.value;

          sessionIds.push(sessionId);
          times++;
        } while (times < 2);
        _.uniq(sessionIds).length.should.equal(1);

        const {status, data} = await axios.delete(
          createSessionURL(sessionIds[0])
        );
        status.should.equal(200);
        should.equal(data.value, null);
      });

      it('should handle idempotency while creating parallel sessions', async function () {
        const reqs = [];
        let times = 0;
        do {
          reqs.push(
            axios.post(newSessionURL, {
              headers: {
                'X-Idempotency-Key': '12345',
              },
              data: {
                capabilities: {
                  alwaysMatch: defaultCaps,
                  firstMatch: [{}],
                },
              },
            })
          );
          times++;
        } while (times < 2);
        const sessionIds = (await B.all(reqs)).map(
          (x) => x.data.value.sessionId
        );
        _.uniq(sessionIds).length.should.equal(1);

        const {status, data} = await axios.delete(
          createSessionURL(sessionIds[0])
        );
        status.should.equal(200);
        should.equal(data.value, null);
      });

      it('should create session and retrieve a session id, then delete it', async function () {
        let {status, data} = await axios.post(newSessionURL, {
          data: {
            capabilities: {
              alwaysMatch: defaultCaps,
              firstMatch: [{}],
            },
          },
        });

        status.should.equal(200);
        should.exist(data.value.sessionId);
        data.value.capabilities.platformName.should.equal(
          defaultCaps.platformName
        );
        data.value.capabilities.deviceName.should.equal(
          defaultCaps['appium:deviceName']
        );

        ({status, data} = await axios.delete(createSessionURL(d.sessionId)));

        status.should.equal(200);
        should.equal(data.value, null);
        should.equal(d.sessionId, null);
      });
    });

    it.skip('should throw NYI for commands not implemented', async function () {});

    describe('command timeouts', function () {
      let originalFindElement, originalFindElements;

      async function startTimeoutSession(timeout) {
        const caps = _.cloneDeep(defaultCaps);
        caps['appium:newCommandTimeout'] = timeout;
        return await startSession(caps);
      }

      before(function () {
        originalFindElement = d.findElement;
        d.findElement = function () {
          return 'foo';
        }.bind(d);

        originalFindElements = d.findElements;
        d.findElements = async function () {
          await B.delay(200);
          return ['foo'];
        }.bind(d);
      });

      after(function () {
        d.findElement = originalFindElement;
        d.findElements = originalFindElements;
      });

      it('should set a default commandTimeout', async function () {
        let newSession = await startTimeoutSession();
        d.newCommandTimeoutMs.should.be.above(0);
        await endSession(newSession.sessionId);
      });

      it('should timeout on commands using commandTimeout cap', async function () {
        let newSession = await startTimeoutSession(0.25);
        // XXX: race condition: we must build this URL before ...something happens...
        // which causes `d.sessionId` to be missing
        let sessionURL = createSessionURL(d.sessionId);
        await axios.post(createAppiumTestURL(d.sessionId, 'element'), {
          data: {using: 'name', value: 'foo'},
        });
        await B.delay(400);
        const {data} = await axios({
          url: sessionURL,
          validateStatus: null,
        });
        should.equal(data.value.error, 'invalid session id');
        should.equal(d.sessionId, null);
        const resp = await endSession(newSession.sessionId);
        should.equal(resp.error, 'invalid session id');
      });

      it('should not timeout with commandTimeout of false', async function () {
        let newSession = await startTimeoutSession(0.1);
        let start = Date.now();
        const {value} = (
          await axios.post(createAppiumTestURL(d.sessionId, 'elements'), {
            data: {using: 'name', value: 'foo'},
          })
        ).data;
        (Date.now() - start).should.be.above(150);
        value.should.eql(['foo']);
        await endSession(newSession.sessionId);
      });

      it('should not timeout with commandTimeout of 0', async function () {
        d.newCommandTimeoutMs = 2;
        let newSession = await startTimeoutSession(0);

        await axios.post(createAppiumTestURL(d.sessionId, 'element'), {
          data: {using: 'name', value: 'foo'},
        });
        await B.delay(400);
        const {value} = (
          await axios({
            url: createSessionURL(d.sessionId),
          })
        ).data;
        value.platformName.should.equal(defaultCaps.platformName);
        const resp = await endSession(newSession.sessionId);
        should.equal(resp, null);

        d.newCommandTimeoutMs = 60 * 1000;
      });

      it('should not timeout if its just the command taking awhile', async function () {
        let newSession = await startTimeoutSession(0.25);
        // XXX: race condition: we must build this URL before ...something happens...
        // which causes `d.sessionId` to be missing
        let sessionURL = createSessionURL(d.sessionId);
        await axios.post(createAppiumTestURL(d.sessionId, 'element'), {
          data: {using: 'name', value: 'foo'},
        });
        await B.delay(400);
        const {value} = (
          await axios({
            url: sessionURL,
            validateStatus: null,
          })
        ).data;
        value.error.should.equal('invalid session id');
        should.equal(d.sessionId, null);
        const resp = await endSession(newSession.sessionId);
        resp.error.should.equal('invalid session id');
      });

      it('should not have a timer running before or after a session', async function () {
        // @ts-expect-error
        should.not.exist(d.noCommandTimer);
        let newSession = await startTimeoutSession(0.25);
        newSession.sessionId.should.equal(d.sessionId);
        // @ts-expect-error
        should.exist(d.noCommandTimer);
        await endSession(newSession.sessionId);
        // @ts-expect-error
        should.not.exist(d.noCommandTimer);
      });
    });

    describe('settings api', function () {
      before(function () {
        d.settings = new DeviceSettings({ignoreUnimportantViews: false});
      });
      it('should be able to get settings object', function () {
        d.settings.getSettings().ignoreUnimportantViews.should.be.false;
      });
      it('should not reject when `updateSettings` method is not provided', async function () {
        await d.settings.update({ignoreUnimportantViews: true}).should.not.be
          .rejected;
      });
      it('should reject for invalid update object', async function () {
        await d.settings
          // @ts-expect-error
          .update('invalid json')
          .should.eventually.be.rejectedWith('JSON');
      });
    });

    describe('unexpected exits', function () {
      /** @type {import('sinon').SinonSandbox} */
      let sandbox;
      beforeEach(function () {
        sandbox = sinon.createSandbox();
      });

      afterEach(function () {
        sandbox.restore();
      });

      it('should reject a current command when the driver crashes', async function () {
        sandbox.stub(d, 'getStatus').callsFake(async function () {
          await B.delay(5000);
        });
        const reqPromise = axios({
          url: createAppiumTestURL('', 'status'),
          validateStatus: null,
        });
        // make sure that the request gets to the server before our shutdown
        await B.delay(100);
        const shutdownEventPromise = new B((resolve, reject) => {
          setTimeout(
            () =>
              reject(
                new Error(
                  'onUnexpectedShutdown event is expected to be fired within 5 seconds timeout'
                )
              ),
            5000
          );
          d.onUnexpectedShutdown(resolve);
        });
        d.startUnexpectedShutdown(new Error('Crashytimes'));
        const {value} = (await reqPromise).data;
        value.message.should.contain('Crashytimes');
        await shutdownEventPromise;
      });
    });

    describe('event timings', function () {
      it('should not add timings if not using opt-in cap', async function () {
        const session = await startSession(defaultCaps);
        const res = await getSession(session.sessionId);
        should.not.exist(res.events);
        await endSession(session.sessionId);
      });
      it('should add start session timings', async function () {
        const caps = Object.assign({}, defaultCaps, {
          'appium:eventTimings': true,
        });
        const session = await startSession(caps);
        const res = await getSession(session.sessionId);
        should.exist(res.events);
        should.exist(res.events.newSessionRequested);
        should.exist(res.events.newSessionStarted);
        res.events.newSessionRequested[0].should.be.a('number');
        res.events.newSessionStarted[0].should.be.a('number');
        await endSession(session.sessionId);
      });
    });

    if (DriverClass === BaseDriver) {
      // only run this test on basedriver, not other drivers which also use these tests, since we
      // don't want them to try and start sessions with these random capabilities that are
      // necessary to test the appium options logic
      describe('special appium:options capability', function () {
        it('should be able to start a session with caps held in appium:options', async function () {
          const ret = await startSession({
            platformName: 'iOS',
            [PREFIXED_APPIUM_OPTS_CAP]: {
              platformVersion: '11.4',
              'appium:deviceName': 'iPhone 11',
            },
          });
          expect(d.opts.platformVersion).to.equal('11.4');
          expect(d.opts.deviceName).to.equal('iPhone 11');
          await endSession(ret.sessionId);
        });
      });
    }
  });
}

/**
 * @template {import('@appium/types').Driver} P
 * @template {import('@appium/types').DriverStatic} S
 * @typedef {import('@appium/types').DriverClass<P,S>} DriverClass
 */
