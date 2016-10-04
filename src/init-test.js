import { options } from './config';


let jsDomCleanUp = null;
let sandbox = null;


before(function () {
    if (options.jsdom) {
        jsDomCleanUp = require('jsdom-global')();
    }
});


beforeEach(() => {
    sandbox = sinon.sandbox.create({
        injectInto: mokamok,
        properties: ["spy", "stub", "mock", "clock", "server", "requests"],
        useFakeTimers: true,
        useFakeServer: true
    });
});

afterEach(function () {
    sandbox.restore();
    if (options.jsdom) {
        jsDomCleanUp();
    }
});
