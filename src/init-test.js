import { options } from './config';


let jsDomCleanUp = null;


before(function () {
    if (options.jsdom) {
        jsDomCleanUp = require('jsdom-global')();
    }
});


afterEach(function () {
    if (options.jsdom) {
        jsDomCleanUp();
    }
});
