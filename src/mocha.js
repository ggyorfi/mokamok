import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';


global.sinon = sinon;
global.expect = chai.expect;
global.chai = chai;
chai.use(sinonChai);
