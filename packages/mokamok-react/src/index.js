import fs from 'fs';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';


require('jsdom-global')();
const $ = global.jQuery = require('jquery');


function toJSON(el) {
    if (!el.tagName) {
        return el.textContent;
    }
    const json = { type: el.tagName };
    if (el.attributes && el.attributes.length) {
        json.props = {};
        for (let i = 0; i < el.attributes.length; i++) {
            var attr = el.attributes[i];
            json.props[attr.name] = attr.value;
        }
    }
    if (el.childNodes && el.childNodes.length) {
        json.children = [];
        for (let i = 0; i < el.childNodes.length; i++) {
            json.children.push(toJSON(el.childNodes[i]));
        }
    }
    return json;
}


function toHTML(el, indent = '') {
    const tagName = el.tagName.toLowerCase();
    let html = `${indent}<${tagName}`;
    const hasProps = el.attributes && el.attributes.length;
    if (hasProps) {
        for (let i = 0; i < el.attributes.length; i++) {
            const attr = el.attributes[i];
            if (attr.name !== 'data-reactroot') {
                let value = attr.value;
                html += ` ${attr.name}="${value}"`;
            }
        }
    }
    if (el.childNodes && el.childNodes.length) {
        let textOnly = true;
        for (let i = 0; i < el.childNodes.length; i++) {
            if (el.childNodes[i] instanceof Element) {
                textOnly = false;
                break;
            }
        }
        html += `>${textOnly ? '' : '\n'}`;
        let indent2 = `${indent}  `;
        for (let i = 0; i < el.childNodes.length; i++) {
            const child = el.childNodes[i];
            if (child instanceof Element) {
                html += toHTML(child, indent2);
            }
            if (child instanceof Text && child.data.length > 0) {
                html += `${textOnly ? '' :
                    indent2}${child.data}${textOnly ? '' : '\n'}`;
            }
        }
        return `${html}${textOnly ? '' : indent}</${tagName}>\n`;
    }
    return `${html}${hasProps ? ' ' : ''}/>\n`;
}

function renderNode(node) {
    const isComponenet = typeof node.type === 'function';
    const tag = isComponenet ? 'COMPONENT' : node.type;
    const el = document.createElement(tag);
    if (node.props) {
        let children;
        for (var name in node.props) {
            if (node.props.hasOwnProperty(name)) {
                let value = node.props[name];
                if (name === 'children') {
                    children = value;
                } else {
                    if (typeof value === 'function') {
                        name = name.toLowerCase();
                        el[name] = value;
                    } else {
                        el.setAttribute(name, value);
                    }
                }
            }
        }
        if (children) {
            if (Array.isArray(children)) {
                for (var i = 0; i < children.length; i++) {
                    const child = children[i];
                    if (typeof child === 'string') {
                        el.appendChild(document.createTextNode(child));
                    } else {
                        el.appendChild(renderNode(child));
                    }
                }
            } else if (typeof children === 'string') {
                el.textContent = children;
            } else {
                el.appendChild(renderNode(children));
            }
        }
    }
    return el;
}


$.fn.simulate = function simulate(event, ...args) {
    $.each(this, function (idx, el) {
        let isShallow = true;
        for (var name in el) {
            // detect react rendered elements, can be improved
            if (el.hasOwnProperty(name)) {
                if (name.indexOf('__react') !== -1) {
                    isShallow = false;
                }
            }
        }
        if (isShallow) {
            const handler = el[`handle${event}`] || el[`on${event}`];
            if (handler) {
                handler(...args);
            } else {
                // TODO:  huh, its ugly, find a better way to
                //        simulate normal DOM events
                const e = document.createEvent("Events");
                e.initEvent(event, true, true);
                el.dispatchEvent(e);
            }
        } else {
            TestUtils.Simulate[event](el, ...args);
        }
    });
};


export function init(ctx) {
    const { options, getCurrentTest, events } = ctx;
    chai.use(require('chai-jquery'));
    const Assertion = chai.Assertion;
    Assertion.addChainableMethod('match');
    Assertion.addMethod('snapshot', function (testName, update) {
        if (testName === true && arguments.length < 2) {
            testName = null;
            update = true;
        }

        if (options.updateSnapshots) {
            update = true;
        }

        const obj = this._obj;
        const actual = obj.toHTML().trim();
        const test = getCurrentTest();
        const fname = test.file + '.snap';
        const id = test.fullTitle() + (testName || '');

        let snapshots = {};
        let expected;
        try {
            snapshots = require(fname);
            if (!update && snapshots[id]) {
                expected = snapshots[id];
            } else {
                update = true;
            }
        } catch (err) {
            update = true;
        }

        if (update) {
            snapshots[id] = actual;
            fs.writeFileSync(fname, Object.keys(snapshots).reduce((exp, key) => {
                // TODO: - cache the snapshots
                //       - collect the updates
                //       - lazy async save
                //       - uncache module on write
                return `${exp}exports['${key}'] = \`${snapshots[key].replace(/`/g, '\\`')}\`;\n`;
            }, ''));
        } else {
            this.assert(
                actual === expected,
                "expected snapshot to match",
                "expected snapshot not to match",
                expected,
                actual,
                true
            );
        }
    });
    const currentNodes = [];
    options.jsdom = true;
    events.on('after-each', () => {
        for (var i = 0; i < currentNodes.length; i++) {
            ReactDOM.unmountComponentAtNode(currentNodes[i].parent()[0]);
        }
        currentNodes.length = 0;
    });
    const eventHandlerPatternRx = new RegExp( '^(?:on|handle)[A-Z_].*' ||
        options.eventHandlerPattern);
    Object.assign(mokamok, {

        render(el) {
            class PropChangeContainer extends React.Component {

                constructor(props) {
                    super(props);
                    this.state = props;
                }

                render() {
                    return React.createElement(el.type, this.state);
                }

            }

            const container = TestUtils.renderIntoDocument(<PropChangeContainer {...el.props}/>);
            const node = $(ReactDOM.findDOMNode(container));

            try {
                node.component = TestUtils.findRenderedComponentWithType(container, el.type);
            } catch (err) {
                // NOOP
            }

            node.setProps = function (props) {
                container.setState(props);
            };

            node.toJSON = function() {
                return toJSON(node[0]);
            };

            node.toHTML = function() {
                return toHTML(node[0]);
            }

            currentNodes.push(node);
            return node;
        },

        shallow(el) {
            const renderer = TestUtils.createRenderer();
            renderer.render(el);
            const doc = renderer.getRenderOutput();
            const node = $(renderNode(doc));
            node.toJSON = function() {
                return toJSON(node[0]);
            };
            node.toHTML = function() {
                return toHTML(node[0], '');
            }
            return node;
        },

        stubEventHandlers(cl) {
            let obj = cl.prototype || cl;
            const stubs = {};
            while (obj) {
                Object.getOwnPropertyNames(obj).forEach(name => {
                    if (eventHandlerPatternRx.test(name) && !stubs[name]) {
                        stubs[name] = sandbox.stub(obj, name);
                    }
                });
                obj = obj.__proto__;
            }
            return stubs;
        },

    });
};


export function initBabel(config) {
    config.presets.push(require.resolve('babel-preset-react'));
}
