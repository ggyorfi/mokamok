import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import watch from './watch';
import runAllTest from './run-all-tests';
import { options } from './config';
import { registerRequireHook } from './require-hook';
import babelRegister from 'babel-register';


global.sinon = sinon;
global.expect = chai.expect;
chai.use(sinonChai);


babelRegister({
    presets: [
        require.resolve('babel-preset-latest'),
    ],
});

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
