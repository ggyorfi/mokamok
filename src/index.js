import {} from './mocha';
import watch from './watch';
import runAllTest from './run-all-tests';
import { options } from './config';
import { registerRequireHook } from './require-hook';
import coverage from './coverage';
import { getCurrentTest, events } from './context';
// console._log_mm = console.log;
// console.log = function (...args) {
//     let err;
//     console.trace();
//     this._log_mm(...args);
// };


const cwd = process.cwd();
const plugins = [];
const availablePlugins = [
    'mokamok-react'
];


for (let i = 0; i < availablePlugins.length; i++) {
    const plugin = availablePlugins[i];
    try {
        plugins.push(require(plugin));
    } catch (err) {
        // NOOP
    }
}


if (options.babelPresets.length === 0) {
    // pick the latest available preset
    const names = [ 'latest' ];
    let year = new Date().getFullYear() + 2;
    while (year > 2015) {
        names.push(year.toString());
        year--;
    }
    for (var i = 0; i < names.length; i++) {
        try {
            const name = names[i];
            require(`babel-preset-${name}`);
            options.babelPresets.push(name);
            break;
        } catch (err) {
            // NOOP
        }
    }
}


function resolveBabelExt(type, path) {
    if (path[0] === '.' || path[0] === '/') {
        return require.resolve(`${cwd}/${path}`);
    }
    return require.resolve(`babel-${type}-${path}`);
}


if (options.babel) {
    const babelRegister = require('babel-register');
    const config = {
        presets: options.babelPresets.map(item =>
            resolveBabelExt('preset', item)),
        plugins: options.babelPlugins.map(item =>
            resolveBabelExt('plugin', item)),
    };
    if (options.coverage) {
        config.plugins.push([
            require.resolve('babel-plugin-istanbul'), {
                exclude: [
                    `**/${options.testDirectory}/**/*`,
                    '**/node_modules/**/*'
                ].concat(options.coverageExclude),
            },
        ]);
    }
    for (let i = 0; i < plugins.length; i++) {
        plugins[i].initBabel(config);
    }
    config.plugins.push(require.resolve('./babel-hoist'));
    babelRegister(config);
}


registerRequireHook();


for (let i = 0; i < plugins.length; i++) {
    plugins[i].init({
        options,
        getCurrentTest,
        events
    });
}


runAllTest().then(() => {
    if (options.watch) {
        console.log('Done');
        watch();
    } else if (options.coverage) {
        coverage();
        console.log('Done');
    } else {
        console.log('Done');
    }
}).catch((err) => {
    console.log(err);
    console.log('\nDone');
    if (options.watch) {
        watch();
    } else {
        process.exit(1);
    }
});
