import path from 'path';
import Module from 'module';
import { mockObject } from './automock';
import { addDependency, getMock } from './mokamok';
import { options } from './config';

const rootPath = path.resolve('.');


let prevRequire = null;
let cache = {};
let removeQueue = [];


function requireHook(name) {
    const modulePath = Module._resolveFilename(name, this);
    let module = prevRequire.bind(this)(name);

    if (modulePath.charAt(0) !== '/') {
        return module;
    }

    if (cache[modulePath]) {
        return cache[modulePath];
    }

    const projectFile = modulePath.indexOf(rootPath) === 0 &&
        modulePath.indexOf('/node_modules/') === -1 &&
        modulePath.indexOf('/__test__/') === -1;

    if (projectFile) {
        addDependency(modulePath);
    }

    const mock = getMock(modulePath);

    if (mock === false) {
        return module;
    }

    var autoMock = options.automock && projectFile;

    if (mock || autoMock) {
        if (mock  && mock.mock) {
            module = mock.mock;
        } else {
            module = mockObject(module);
        }
        cache[modulePath] = module;
    }

    if (projectFile) {
        removeQueue.push(modulePath);
    }

    return module;
}


export function registerRequireHook() {
    if (Module.prototype.require !== requireHook) {
        prevRequire = Module.prototype.require;
        Module.prototype.require = requireHook;
    }
}

export function cleanUp() {
    let cache = {};
    let removeQueue = [];
}
