import path from 'path';
import { uncache } from './require-hook';


let deps = {};
let mocks = {};
let testFile = null;
let testDir = null;


export function getMock(name) {
    return mocks[name];
}


export function setTestFile(fileName) {
    testFile = fileName;
    testDir = path.dirname(testFile);
}


export function addDependency(modulePath) {
    deps[modulePath] = testFile;
}


export function getDependency(modulePath) {
    return deps[modulePath];
}


export function removeDependencies(testFile) {
    const newDeps = {};
    for (let key in deps) {
        if (deps.hasOwnProperty(key)) {
            const fname = deps[key];
            if (fname !== testFile) {
                newDeps[key] = fname;
            }
        }
    }
    deps = newDeps;
}


export function cleanUp() {
    mocks = {};
    testFile = null;
    testDir = null;
}


function getMockName(name) {
    if (name[0] === '.') {
        const fileName = path.normalize(`${testDir}/${name}`);
        return require.resolve(fileName);
    }
    return require.resolve(name);
}


global.mokamok = {

    mock(name, mock) {
        const path = getMockName(name);
        if (process.env.TRACE_MOCK && path.indexOf(process.env.TRACE_MOCK) !== -1) {
            console.log("mock:", path);
        }
        mocks[path] = { mock };
        uncache(path);
    },

    unmock(name) {
        const path = getMockName(name);
        if (process.env.TRACE_MOCK && path.indexOf(process.env.TRACE_MOCK) !== -1) {
            console.log("unmock:", path);
        }
        mocks[path] = false;
        uncache(path);
    },

    forceReload(name) {
        uncache(getMockName(name));
    },

};
