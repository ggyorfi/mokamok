import glob from 'glob';
import runTest from './run-test';

export default function runAllTests(callback) {
    return new Promise((resolve, reject) => {
        glob("**/__test__/*.js", function (err, files) {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            function next(idx) {
                if (idx < files.length) {
                    runTest(files[idx]).then(err => {
                        if (err) {
                            reject(err);
                        }
                        next(idx + 1);
                    }).catch((err) => {
                        reject(err);
                    });
                } else {
                    resolve();
                }
            }
            next(0);
        });
    });
};
