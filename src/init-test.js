import { options } from './config';

let jsDomCleanUp = null;
let jsdom = null;


if(options.jsdom) {
    jsdom = require('jsdom-global');
}


beforeEach(() => {
    if (jsdom) {
        jsDomCleanUp = jsdom();
    }
    global.sandbox = sinon.sandbox.create();
});


afterEach(function () {
    global.sandbox.restore();
    if (jsdom) {
        jsDomCleanUp();
    }
});
