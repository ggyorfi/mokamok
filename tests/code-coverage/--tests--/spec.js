import { fn1 } from '../test';

describe("Code coverage", () => {

    it("test one of the functions", () => {
        expect(fn1()).to.equal(1);
    });

});
