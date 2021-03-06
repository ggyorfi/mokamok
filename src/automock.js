import sinon from 'sinon';


const stubs = [];


export function mockValue(value) {
    if (typeof value === 'function') {
        return mockClassOrFunction(value);
    } else if (Array.isArray(value)) {
        return mockArray(value);
    } else if (typeof value === 'object') {
        return mockObject(value);
    }
    return value;
};


export function mockObject(obj) {
    const stub = {};
    const propNames = Object.getOwnPropertyNames(obj);
    for (let i = 0; i < propNames.length; i++) {
        const key = propNames[i];
        stub[key] = mockValue(obj[key]);
    }
    return stub;
};


export function mockArray(array) {
    const stub = [];
    for (let i = 0; i < array.length; i++) {
        stub[i] = mockValue(array[i]);
    }
    return stub;
};


export function mockClassOrFunction(fn) {
    // TODO: can we mock functions without mocking the constructor?
    const stub = sinon.spy(function () {
        return sinon.createStubInstance(fn);
    });
    Object.defineProperty(stub, 'instances', {
        get: function() {
            return this.returnValues;
        },
    });
    stubs.push(stub);
    return stub;
};


export function reset() {
    for (let i = 0; i < stubs.length; i++) {
        stubs[i].reset();
    }
};


export function cleanUp() {
    stubs.length = 0;
};
