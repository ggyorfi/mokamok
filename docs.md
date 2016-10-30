---
layout: default
---

<div class="page-wrap">

<nav markdown="1">

* [Install](#install)
* [Getting Started](#getting-started)
    * [Watch mode](#watch-mode)
    * [Using mocks](#mocks)
    * [Automock](#automock)
    * [Jsdom support](#jsdom)
    * [Testing React](#testing-react)
* [Command line options](#cli)

</nav>

<article markdown="1">

## <a name="install" class="anchor"></a>Install

```bash
$ npm install --save-dev mokamok
```

## <a name="getting-started" class="anchor"></a>Getting Started

Create a directory called `--tests--`, and add a test file `increment.spec.js`:

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

```
"scripts": {
    "test": "mokamok"
},
```

Run the test:

```bash
$ npm test
```

## <a name="watch-mode" class="anchor"></a>Watch mode

Watch mode makes it easy for developers to see the effects of code changes immediately. Watch mode
cna be initiated with the `--watch` or `-w` command line option. Mokamok will run the test suit
every time wen any of the source or test files is modified.


## <a name="mocks" class="anchor"></a>Using mocks

Mokamok makes it easy to break the link between the tested module and it's dependencies. In order
to mock a module, use the `mokamok.mock()` api call before importing the module:

```javascript
mokamok.mock('depndency-module');

import myModule from 'my-module';
```

this will replace all exports in the dependency module with a stub. When the module exports
a class then all instance of the class will be mocked.

With the the mock function you can provide your own mock object as the second parameter:

```javascript
mokamok.mock('depndency-module', {
    __esModule: true,
    default: () => 'VALUE',
    otherFunction: () => 'OTHER_VALUE'
});
```

Mokamok is based on [Sinon](http://sinonjs.org/) so all mocked dependencies can be tested easily:

```javascript
mokamok.mock('depndency-module');

import myModule from 'my-module';
import depndencyModule from 'depndency-module';

it("should call the do() function", function () {
    const param = Symbol();
    myModule.exec(param);
    expect(depndencyModule.do).to.be.calledWithExactly(param);
});
```
For more information check the [Sinon](http://sinonjs.org/) documentation.


## <a name="automock" class="anchor"></a>Automock

Mokamok can be configured to automatically mock every module with the `--automock` or `-m` command
line options or `automock: true` property in the `.mokamokrc` file. When the automock functionality
is turned on, the actual tested file need to be unmocked before imported:

```javascript
mokamok.unmock('my-module');

import myModule from 'my-module';
```

In the example above every module but `my-module.js` will be mocked automatically.

</article>

</div>
