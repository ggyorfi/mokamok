import Mocha from 'mocha';
import path from 'path';
import { setTestFile } from './mokamok';

function addFile(mocha, filePath) {
    delete require.cache[filePath];
    mocha.addFile(filePath);
}

export default function runTest(testFile, callback) {
    return new Promise((resolve, reject) => {
        const initPath = path.normalize(`${__dirname}/init-test.js`);
        const testPath = path.resolve(testFile);
        setTestFile(testPath);
        const mocha = new Mocha();
        addFile(mocha, initPath);
        addFile(mocha, testPath);
        mocha.run(failures => {
            if (failures > 0) {
                reject(failures);
            } else {
                resolve();
            }
        });
    });
};
