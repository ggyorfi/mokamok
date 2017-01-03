import path from 'path';
import Module from 'module';
import { mockObject } from './automock';
import { setTestFile, addDependency, getMock } from './mokamok';
import { options } from './config';
import { cleanUp as cleanUpAutomock } from './automock';
import { cleanUp as cleanUpMokamok } from './mokamok';


const rootPath = path.resolve('.');
const testDir = `/${options.testDirectory}/`;


let _load = null;
let cache = {};
let deps = {};

const mockedModules = [];

const ignore = {
    '.css': true,
    '.scss': true,
    '.sass': true,
}


function load(request, parent, isMain) {
    if (ignore[path.extname(request)]) {
        return {};
    }

    const modulePath = Module._resolveFilename(request, parent, isMain);

    const isTestFile = modulePath.indexOf(testDir) !== -1;

    if (isTestFile) {
        cleanUpMokamok();
        cleanUpAutomock();
        cleanUp();
        setTestFile(modulePath);
    }

    const mock = getMock(modulePath);

    if (mock && mock.mock) {
        mockedModules.push(modulePath);
        return mock.mock;
    }

    let module = _load(request, parent, isMain);

    if (modulePath.charAt(0) !== '/') {
        return module;
    }

    if (cache[modulePath]) {
        return cache[modulePath];
    }

    if (process.env.TRACE_MOCK &&  modulePath.indexOf(process.env.TRACE_MOCK) !== -1) {
        console.log("load:", modulePath);
    }

    const isProjectFile = modulePath.indexOf(rootPath) === 0 &&
        modulePath.indexOf('/node_modules/') === -1 && !isTestFile;

    if (isProjectFile) {
        addDependency(modulePath);
        const dep = deps[parent.id] || (deps[parent.id] = []);
        dep.push(modulePath);
    }

    if (mock === false) {
        if (process.env.TRACE_MOCK &&  modulePath.indexOf(process.env.TRACE_MOCK) !== -1) {
            console.log("unmock:", modulePath);
        }
        mockedModules.push(modulePath);
        return module;
    }

    const autoMock = options.automock && isProjectFile;

    if (mock || autoMock) {
        if (process.env.TRACE_MOCK &&  modulePath.indexOf(process.env.TRACE_MOCK) !== -1) {
            console.log("mock:", modulePath);
        }
        mockedModules.push(modulePath);
        module = cache[modulePath] = mockObject(module);
    }

    return module;
}


export function registerRequireHook() {
    if (Module._load !== load) {
        _load = Module._load;
        Module._load = load;
    }
}


export function uncache(name, done = {}) {
    if (process.env.TRACE_MOCK &&  name.indexOf(process.env.TRACE_MOCK) !== -1) {
        console.log("uncache:", name);
    }
    done[name] = true;
    delete cache[name];
    delete Module._cache[name];
    const dep = deps[name];
    if (dep) {
        for (let i = 0; i < dep.length; i++) {
            const dname = dep[i];
            if (!done[dname]) {
                uncache(dname, done);
            }
        }
    }
    delete deps[name];
}


export function cleanUp() {
    mockedModules.forEach(uncache);
    mockedModules.length = 0;
}
