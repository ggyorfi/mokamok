import Mocha from 'mocha';
import path from 'path';


const initPath = path.normalize(`${__dirname}/init-test.js`);


let mocha = null;


function addFile(mocha, filePath) {
    delete require.cache[filePath];
    mocha.addFile(filePath);
}


export function addTestFile(testFile) {
    const testPath = path.resolve(testFile);
    if (!mocha) {
        mocha = new Mocha();
        addFile(mocha, initPath);
    }
    addFile(mocha, testPath);
};


export function runTests() {
    return new Promise((resolve, reject) => {
        mocha.run(failures => {
            mocha = null;
            if (failures > 0) {
                reject(failures);
            } else {
                resolve();
            }
        });
    });
};
