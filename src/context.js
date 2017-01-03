import EventEmitter from 'events';


let currentTest;


export function setCurrentTest(test) {
    currentTest = test;
}


export function getCurrentTest() {
    return currentTest;
}


export const events = new EventEmitter();
