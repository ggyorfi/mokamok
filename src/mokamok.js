import path from 'path';


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
    for (var key in deps) {
        if (deps.hasOwnProperty(key)) {
            var fname = deps[key];
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
    const fileName = path.normalize(`${testDir}/${name}`);
    return require.resolve(fileName);
}


global.mokamok = {

    mock: function (name, mock) {
        mocks[getMockName(name)] = { mock };
    },

    unmock: function (name) {
        mocks[getMockName(name)] = false;
    },

};
