import path from 'path';
import Module from 'module';
import { mockObject } from './automock';
import { addDependency, getMock } from './mokamok';
import { options } from './config';

const rootPath = path.resolve('.');

let _load = null;
let cache = {};
let deps = {};


function load(request, parent, isMain) {
    const modulePath = Module._resolveFilename(request, parent, isMain);

    let module = _load(request, parent, isMain);

    if (modulePath.charAt(0) !== '/') {
        return module;
    }

    if (cache[modulePath]) {
        return cache[modulePath];
    }

    const projectFile = modulePath.indexOf(rootPath) === 0 &&
        modulePath.indexOf('/node_modules/') === -1 &&
        modulePath.indexOf('/--test--/') === -1;

    if (projectFile) {
        addDependency(modulePath);
        const dep = deps[parent.id] || (deps[parent.id] = []);
        dep.push(modulePath);
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

    return module;
}


export function registerRequireHook() {
    if (Module._load !== load) {
        _load = Module._load;
        Module._load = load;
    }
}

export function uncache(name) {
    delete cache[name];
    delete Module._cache[name];
    const dep = deps[name];
    if (dep) {
        for (var i = 0; i < dep.length; i++) {
            uncache(dep[i]);
        }
    }
    delete deps[name];
}

export function cleanUp() {
    cache = {};
    deps = {};
}
