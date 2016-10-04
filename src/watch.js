import fs from 'fs';
import path from 'path';
import { addTestFile, runTests }from './run-test';
import { removeDependencies, getDependency } from './mokamok';
import { uncache } from './require-hook';
import { options } from './config';


function updateTest(filePath) {
    removeDependencies(filePath);
    addTestFile(filePath);
    runTests().then(() => {
        console.log('Done');
    }).catch(err => {
        console.log('Done');
    });
}


export default function watch() {
    const chokidar = require('chokidar');
    const dir = path.resolve('.');

    const watchOptions = {
        persistent: true,
        ignoreInitial: true,
    };
    if (process.platform == 'linux') {
        watchOptions.awaitWriteFinish = {
            stabilityThreshold: 2000,
            pollInterval: 100,
        };
    }
    const watcher = chokidar.watch(dir + '/**/*', watchOptions);
    watcher.on('all', (event, fileName) => {
        const filePath = path.resolve(fileName);
        if (filePath.indexOf(`/${options.testDirectory}/`) !== -1) {
            uncache(filePath);
            updateTest(filePath);
        } else {
            const testFile = getDependency(filePath);
            if (testFile) {
                uncache(filePath);
                updateTest(testFile);
            }
        }
    });
}
