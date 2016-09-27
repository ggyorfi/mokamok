# Mokamok

Zero configuration JavaScript Unit Testing with Mocha, Chai and Sinon

## Install

```bash
npm install --save-dev mokamok
```

## Getting Started

Create a directory called `__tests__`, and add a test file `increment.spec.js`:

```javascript
import increment from '../increment';

describe("increment.js", () => {

    it("should increment the value", () => {
        expect(increment(7)).to.equal(8);
    });

});
```

Let's implement the `increment.js` module:

```javascript
export default function (v) {
    return v + 1;
}
```

Modify the `package.json` file:

```json
"scripts": {
    "test": "mokamok"
},
```

Run the test:

```bash
npm test
```

## Mokamok API

#### `mokamok.mock(name, [mock])`

Mocks the file

#### `mokamok.unmock(name)`

Stop mocking the file

## Command line options

```

  Usage: index [options]

  Options:

    -h, --help     output usage information
    -v, --version  output the version number
    -m --automock  mock every module in the project automatically
    -j --jsdom     use jsdom
    -w --watch     watch for file changes

```

## Assertions, spies, stubs and mocks

Mokamok is based on [Mocha](https://mochajs.org) and automatically
injects [Chai](http://chaijs.com), [Sinon](http://sinonjs.org) and [sinon-chai](https://github.com/domenic/sinon-chai). Optionally it makes [jsdom](https://github.com/tmpvar/jsdom) available.
