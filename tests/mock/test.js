import Class1, { Class2 } from './class';
import fn1, { fn2 } from './fn';


export function callMethodExportedAsDefault(param) {
    const o = new Class1();
    o.fn(param);
}


export function callMethod(param) {
    const o = new Class2();
    o.fn(param);
}


export function callFunctionExportedAsDefault(param) {
    fn1(param);
}


export function callFunction(param) {
    fn2(param);
}
