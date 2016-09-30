import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import watch from './watch';
import runAllTest from './run-all-tests';
import { options } from './config';
import { registerRequireHook } from './require-hook';


global.sinon = sinon;
global.expect = chai.expect;
chai.use(sinonChai);


registerRequireHook();


runAllTest().then(() => {
    if (options.watch) {
        watch();
    }
}).catch((err) => {
    if (options.watch) {
        watch();
    } else {
        process.exit(err);
    }
});
