import _chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

/**
 * Injects `chai`, `chai.should` and `chai.expect` into the global scope.
 */
export function injectGlobals () {
  // @ts-expect-error
  global.chai = _chai.use(chaiAsPromised).use(sinonChai);
  global.should = _chai.should();
  global.expect = _chai.expect;
}
