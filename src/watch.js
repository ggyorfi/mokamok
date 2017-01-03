import fs from 'fs';
import path from 'path';
import { addTestFile, runTests }from './run-test';
import { removeDependencies, getDependency } from './mokamok';
import { uncache } from './require-hook';
import { options } from './config';
import runAllTest from './run-all-tests';

function updateTest(filePath, done) {
    removeDependencies(filePath);
    addTestFile(filePath);
    runTests().then(() => {
        if (done) {
            done();
        }
        console.log('Done');
    }).catch(err => {
        console.log(err);
        if (done) {
            done();
        }
        console.log('Done');
    });
}

function watchCallback(eventType, fileName, done) {
    const filePath = path.resolve(fileName);
    if (filePath.indexOf(`/${options.testDirectory}/`) !== -1 &&
            path.extname(filePath) !== '.snap') {
        uncache(filePath);
        updateTest(filePath, done);
    } else {
        const testFile = getDependency(filePath);
        if (testFile) {
            uncache(filePath);
            updateTest(testFile, done);
        }
    }
}

export default function watch() {
    let lastWatchArgs;
    const dir = path.resolve('.');
    if (process.platform == 'darwin') {
        fs.watch(dir, { recursive: true }, watchCallback);
    } else {
        const chokidar = require('chokidar');
        const watcher = chokidar.watch(dir + '/src/**/*', {
            persistent: true,
            ignoreInitial: true,
            ignored: [
                'node_modules/**/*',
            ],
            awaitWriteFinish: {
                stabilityThreshold: 2000,
                pollInterval: 100,
            }
        });
        watcher.on('all', (...args) => {
            lastWatchArgs = args;
            watchCallback(...args);
        });
    }
    var stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', function (key) {
        if (key === '\u0003') {
            process.exit();
        } else if (key === 'a') {
            runAllTest().then(() => {
                console.log('Done');
            }).catch((err) => {
                console.log(err);
                console.log('\nDone');
            });
        } else if (key === 'u') {
            const prevUpdateSnapshots = options.updateSnapshots;
            options.updateSnapshots = true;
            if (lastWatchArgs) {
                watchCallback(...lastWatchArgs, () => {
                    options.updateSnapshots = prevUpdateSnapshots;
                });
            } else {
                runAllTest().then(() => {
                    options.updateSnapshots = prevUpdateSnapshots;
                    console.log('Done');
                }).catch((err) => {
                    console.log(err);
                    options.updateSnapshots = prevUpdateSnapshots;
                    console.log('\nDone');
                });
            }
        }
    });
}
