import test from '../test';

describe("Watch the test files", () => {

    it("should run twice", () => {
        expect(test()).to.equal(1);
    });

});
