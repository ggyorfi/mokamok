import {} from './mocha';
import watch from './watch';
import runAllTest from './run-all-tests';
import { options } from './config';
import { registerRequireHook } from './require-hook';
import coverage from './coverage';


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


if (options.babel) {
    const babelRegister = require('babel-register');
    const config = {
        presets: [
            require.resolve('babel-preset-latest'),
        ],
        plugins: [],
    };
    if (options.coverage) {
        config.plugins.push([
            require.resolve('babel-plugin-istanbul'), {
                exclude: [
                    `**/${options.testDirectory}/**/*`,
                    '**/node_modules/**/*'
                ],
            },
        ]);
    }
    for (let i = 0; i < plugins.length; i++) {
        plugins[i].initBabel(config);
    }
    babelRegister(config);
}


registerRequireHook();


for (let i = 0; i < plugins.length; i++) {
    plugins[i].init(options);
}


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
    console.log(err);
    console.log('\nDone');
    if (options.watch) {
        watch();
    } else {
        process.exit(1);
    }
});
