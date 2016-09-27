import fs from 'fs';
import path from 'path';
import runTest from './run-test';
import { removeDependencies, getDependency } from './mokamok';

function updateTest(filePath) {
    removeDependencies(filePath);
    runTest(filePath);
}

export default function watch() {
    fs.watch('.', { recursive: true }, (eventType, fileName) => {
        const filePath = path.resolve(fileName);
        const testFile = getDependency(filePath);
        if (filePath.indexOf('/__test__/') !== -1) {
            updateTest(filePath);
        } else if (testFile) {
            updateTest(testFile);
        }
    });
}
