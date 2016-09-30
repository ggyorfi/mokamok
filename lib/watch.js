import fs from 'fs';
import path from 'path';
import runTest from './run-test';
import { removeDependencies, getDependency } from './mokamok';

function updateTest(filePath) {
    runTest(filePath).catch(err => {
        // IGNORE
    });
}

export default function watch() {
    fs.watch('.', { recursive: true }, (eventType, fileName) => {
        const filePath = path.resolve(fileName);
        if (filePath.indexOf('/--tests--/') !== -1) {
            removeDependencies(filePath);
            updateTest(filePath);
        } else {
            const testFile = getDependency(filePath);
            if (testFile) {
                console.log("1:", testFile );
                removeDependencies(testFile);
                console.log("2:", filePath );
                removeDependencies(filePath);
                updateTest(testFile);
             }
        }
    });
}
