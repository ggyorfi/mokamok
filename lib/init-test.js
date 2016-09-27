import { options } from './config';
import { cleanUp as cleanUpAutomock, reset as resetAutomock } from './automock';
import { cleanUp as cleanUpMokamok } from './mokamok';
import { cleanUp as cleanUpRequireHook } from './require-hook';

let jsDomCleanUp = null;


before(function () {
    if (options.jsdom) {
        jsDomCleanUp = require('jsdom-global')();
    }
});


afterEach(function () {
    resetAutomock();
});


after(function () {
    if (options.jsdom) {
        jsDomCleanUp();
    }
    cleanUpMokamok();
    cleanUpAutomock();
    cleanUpRequireHook();
});
