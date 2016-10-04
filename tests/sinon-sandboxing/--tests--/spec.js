import test from '../test';

describe("Sinon sandboxing", () => {

    it("creates a stub", () => {
        mokamok.stub(test, 'fn1');
    });

    it("creates a stub on the same object", () => {
        mokamok.stub(test, 'fn1');
    });

});
