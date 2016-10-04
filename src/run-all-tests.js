import glob from 'glob';
import { addTestFile, runTests } from './run-test';
import { options } from './config';

export default function runAllTests(callback) {
    return new Promise((resolve, reject) => {
        glob(`**/${options.testDirectory}/*.js`, function (err, files) {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            files = files.filter(fname => fname.indexOf('node_modules') === -1);
            for (var i = 0; i < files.length; i++) {
                addTestFile(files[i]);
            }
            runTests().then(err => {
                if (err) {
                    reject(err);
                }
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    });
};
