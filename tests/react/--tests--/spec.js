import React from 'react';
import Test from '../test';

describe("react", () => {

    it("should render components", () => {
        const node = mokamok.render(<Test text="React" />);
        expect(node.find('>span').text()).to.equal('React');
    });

    it("should handle events with rendered components", () => {
        const stubs = mokamok.stubEventHandlers(Test);
        const node = mokamok.render(<Test text="React" />);
        node.find('>span').simulate('click');
        expect(stubs.onClick).to.be.calledOnce;
        node.find('li:first-child').simulate('blur');
        expect(stubs.onBlur).to.be.calledOnce;
    });

    it("should shallow render components", () => {
        const node = mokamok.shallow(<Test text="React" />);
        expect(node.find('>span').text()).to.equal('React');
    });

    it("should handle events with shallow rendered components", () => {
        const stubs = mokamok.stubEventHandlers(Test);
        const node = mokamok.shallow(<Test text="React" />);
        node.find('>span').simulate('click');
        expect(stubs.onClick).to.be.calledOnce;
        node.find('li:first-child').simulate('blur');
        expect(stubs.onBlur).to.not.be.called;
    });

    it("should add chai jquery", function () {
        const node = mokamok.render(<Test text="React" />);
        expect(node).have.css('background', 'rgb(255, 0, 0)');
        expect(node.find('>a')).have.attr('href', 'http://github.com/ggyorfi/mokamok');
    });

});
