---
layout: default
---

<div class="page-wrap">

<nav markdown="1">

* [Install](#install)
* [Getting Started](#getting-started)
    * [Running the first test](running-the-first-test)
    * [Watch mode](#watch-mode)
    * [Coverage report](#coverage)
    * [Using mocks](#mocks)
    * [Automock](#automock)
    * [Jsdom support](#jsdom)
    * [Testing React](#testing-react)
* [API Docs](#api)
    * [mokamok.mock()](#api-sandbox-mock)
    * [mokamok.unmock()](#api-mokamok-unmock)
    * [sandbox.mock()](#api-sandbox-mock)
    * [sandbox.spy()](#api-sandbox-spy)
    * [sandbox.stub()](#api-sandbox-stub)
    * [sandbox.render()](#api-mokamok-render)
    * [sandbox.shallow()](#api-mokamok-shallow)
    * [sandbox.stubEventHandlers()](#api-mokamok-stub-event-handlers)
* [Command line options](#cli)

</nav>

<article markdown="1">

# <a name="install" class="anchor"></a>Install

Mokamok can be installed with npm:

```bash
$ npm install --save-dev mokamok
```

# <a name="getting-started" class="anchor"></a>Getting Started

## <a name="running-the-first-test" class="anchor"></a>Running the first test

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


## <a name="coverage" class="anchor"></a>Coverage report

Mokamok can build full code coverage report with the `--coverage` or `-c` command line options
or `coverage: true` property in the `.mokamokrc` file. The test runner will print the summary
of the report and generate the full report into the coverage directory. The coverage report is
not generated in watch mode.


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
Mokamok resets every mocks after each tests. For more information on how to use
[Sinon](http://sinonjs.org/) check the documentation: <http://sinonjs.org/docs/>


## <a name="automock" class="anchor"></a>Automock

Mokamok can be configured to automatically mock every module with the `--automock` or `-m` command
line options or `automock: true` property in the `.mokamokrc` file. When the automock functionality
is turned on, the actual tested file need to be unmocked before imported:

```javascript
mokamok.unmock('my-module');

import myModule from 'my-module';
```

In the example above every module but `my-module.js` will be mocked automatically.


## <a name="jsdom" class="anchor"></a>Jsdom support

Jsdom support can be enabled with the `--jsdom` or `-j` command line options or `jsdom: true`
property in the `.mokamokrc` file. With jsdom turned on Mokamok makes the browser environment
available in nodejs. Mokamok resets jsdom after every test.


## <a name="testing-react" class="anchor"></a>Testing React

### Setup

Install the `mokamok-react` package:

```bash
npm install --save-dev mokamok-react
```

### Rendering react components

React component can be rendered with the `mokamok.render()` API
call. This function will render all nested components.

```javascript
import React from 'react';
import Test from '../test';

let node;

beforeEach(function () {
    node = mokamok.render(<Test text="React" />);
});
```

### Shallow rendering

Shallow rendering lets you render a component "one level deep". With a shallow
rendered node you can test the top level and the child components but not the children of the

```javascript
import React from 'react';
import Test from '../test';

let node;

beforeEach(function () {
    node = mokamok.shallow(<Test text="React" />);
});
```

### Testing the components

You can find elements in rendered component with full
[jQuery selectors](http://api.jquery.com/category/selectors/) and assert them with
[cahi-jquery](https://github.com/chaijs/chai-jquery). Shallow rendered component can be
tested in the exact same way as full rendered ones. The only difference is that on the
external components only the properties are accessible not the children.

```javascript
import React from 'react';
import Test from '../test';

it("should render components", () => {
    const node = mokamok.render(<Test text="React" />);
    expect(node.find('>span')).to.have.text('React');
    expect(node.find('a:first-child')).to.have
        .attr('href', 'http://github.com/ggyorfi/mokamok');
});
```

<!-- TODO:

### Testing event handlers

### Using Ensime

-->

# <a name="api" class="anchor"></a>API Docs


## <a name="api-sandbox-mock" class="anchor"></a>mokamok.mock(moduleName, [mock])

Marks the module to be mocked (see: [Using mocks](#mocks))

**Parameters:**

- moduleName : *String* - the name of the module
- mock : *Object* (optional) - the mock object


## <a name="api-mokamok-unmock" class="anchor"></a>mokamok.unmock(moduleName)

Marks the module to not be mocked (see: [Using mocks](#mocks))

**Parameters:**

- moduleName : *String* - the name of the module


## <a name="api-sandbox-mock" class="anchor"></a>sandbox.mock(obj)

Sandboxed version of the sinon.mock() api function. (see:
<a href="http://sinonjs.org/docs/#mocks" target="_blank">Mocks</a> and
<a href="http://sinonjs.org/docs/#sandbox" target="_blank">Sandboxes</a>).


## <a name="api-sandbox-spy" class="anchor"></a>sandbox.spy([myFunc])

Sandboxed version of the sinon.spy() api call. (see:
<a href="http://sinonjs.org/docs/#spies" target="_blank">Test spies</a> and
<a href="http://sinonjs.org/docs/#sandbox" target="_blank">Sandboxes</a>).


## <a name="api-sandbox-stub" class="anchor"></a>sandbox.stub([object, "method", [func]])

Sandboxed version of the sinon.stub() api call. (see:
<a href="http://sinonjs.org/docs/#stubs" target="_blank">Test stubs</a> and
<a href="http://sinonjs.org/docs/#sandbox" target="_blank">Sandboxes</a>).


## <a name="api-mokamok-render" class="anchor"></a>sandbox.render(markup)

Renders a React component to full DOM representation. (see: [Testing React](#testing-react))

**Parameters:**

- markup : *JSX* - the rendered React component


## <a name="api-mokamok-shallow" class="anchor"></a>sandbox.shallow(markup)

Renders a React component "one level deep". (see: [Testing React](#testing-react))

**Parameters:**

- markup : *JSX* - the rendered React component


## <a name="api-mokamok-stub-event-handlers" class="anchor"></a>sandbox.stubEventHandlers(Component)

Stubs all event handler (functions starting with 'on' or 'handle' and followed by an upper case
letter in a  React component.

**Parameters:**

- Component : *React.Component* - the component class


# <a name="cli" class="anchor"></a>Command line options

```
Usage: index [options]

  Options:

    -h, --help                   output usage information
    -v, --version                output the version number
    -m, --automock               mock every module in the project automatically
    -j, --jsdom                  use jsdom
    -w, --watch                  watch for file changes
    -c, --coverage               generate a code coverage report
    -d, --test-directory <name>  test directory name
    -B, --no-babel               disable babel support

```


</article>

</div>
