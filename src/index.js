import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import watch from './watch';
import runAllTest from './run-all-tests';
import { options } from './config';
import { registerRequireHook } from './require-hook';
import coverage from './coverage';

global.sinon = sinon;
global.expect = chai.expect;
chai.use(sinonChai);


if (options.babel) {
    const babelRegister = require('babel-register');
    const presets = [
        require.resolve('babel-preset-latest'),
    ];
    const plugins = [];
    if (options.coverage) {
        plugins.push([
            require.resolve('babel-plugin-istanbul'), {
                exclude: [
                    `**/${options.testDirectory}/**/*`,
                    '**/node_modules/**/*'
                ],
            },
        ]);
    }
    babelRegister({ presets, plugins });
}


registerRequireHook();


runAllTest().then(() => {
    if (options.watch) {
        console.log('Done');
        watch();
    } else if (options.coverage) {
        coverage(() => console.log('Done'));
    } else {
        console.log('Done');
    }
}).catch((err) => {
    if (options.watch) {
        console.log('Done');
        watch();
    } else {
        console.log('Done');
        process.exit(err);
    }
});
