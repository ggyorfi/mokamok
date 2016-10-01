import fs from 'fs';
import path from 'path';
import runTest from './run-test';
import { removeDependencies, getDependency } from './mokamok';
import { uncache } from './require-hook';

function updateTest(filePath) {
    removeDependencies(filePath);
    runTest(filePath).catch(err => {
        // IGNORE
    });
}

export default function watch() {
    fs.watch('.', { recursive: true }, (eventType, fileName) => {
        const filePath = path.resolve(fileName);
        if (filePath.indexOf('/--tests--/') !== -1) {
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
