import test from '../test';

describe("Sinon sandboxing", () => {

    it("creates a stub", () => {
        sandbox.stub(test, 'fn1');
    });

    it("creates a stub on the same object", () => {
        sandbox.stub(test, 'fn1');
    });

});
