mokamok.unmock('../test');

const test = require('../test');
const Class1 = require('../class').default;
const Class2 = require('../class').Class2;
const fn1 = require('../fn').default;
const fn2 = require('../fn').fn2;

describe("Automock", () => {

    let param;

    beforeEach(function () {
        param = Symbol();
    });

    it("should mock methods", () => {
        test.callMethod(param);
        expect(Class2.instances[0].fn).to.be.calledWithExactly(param);
    });

    it("should mock methods exported as default", () => {
        test.callMethodExportedAsDefault(param);
        expect(Class1.instances[0].fn).to.be.calledWithExactly(param);
    });

    it("should mock functions", () => {
        test.callFunction(param);
        expect(fn2).to.be.calledWithExactly(param);
    });

    it("should mock functions exported as default", () => {
        test.callFunctionExportedAsDefault(param);
        expect(fn1).to.be.calledWithExactly(param);
    });

});
