import { options } from './config';

let jsDomCleanUp = null;
let sandbox = null;
let jsdom = null;


if(options.jsdom) {
    jsdom = require('jsdom-global');
}


beforeEach(() => {
    if (jsdom) {
        jsDomCleanUp = jsdom();
    }
    sandbox = sinon.sandbox.create({
        injectInto: mokamok,
        properties: ["spy", "stub", "mock", "clock", "server", "requests"],
        useFakeTimers: true,
        useFakeServer: true
    });
});


afterEach(function () {
    sandbox.restore();
    if (jsdom) {
        jsDomCleanUp();
    }
});
