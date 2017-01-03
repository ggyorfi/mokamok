import { options } from './config';
import { events, setCurrentTest } from './context';


if (options.jsdom) {
    require('jsdom-global')();
}


beforeEach(function () {
    global.sandbox = sinon.sandbox.create();
    setCurrentTest(this.currentTest);
});


afterEach(function () {
    events.emit('after-each');
    global.sandbox.restore();
});
