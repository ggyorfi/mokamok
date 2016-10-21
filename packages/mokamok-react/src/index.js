import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';


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


function toHTML(el, indent) {
    let html = `${indent}<${el.tagName}`;
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
        return `${html}${textOnly ? '' : indent}</${el.tagName}>\n`;
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
            const handler = el[`on${event}`];
            if (handler) {
                handler(...args);
            }
        } else {
            TestUtils.Simulate[event](el, ...args);
        }
    });
};


export function init(options) {
    chai.use(require('chai-jquery'));
    options.jsdom = true;
    Object.assign(mokamok, {

        render(el) {
            let node;
            function render() {
                let doc = TestUtils.renderIntoDocument(el);
                if (doc) {
                    node = $(ReactDOM.findDOMNode(doc));
                    node.doc = doc;
                } else {
                    doc = TestUtils.renderIntoDocument(<div>{el}</div>);
                    node = jQuery(ReactDOM.findDOMNode(doc).children[0]);
                }
                node.reRender = function (props) {
                    if (node.doc) {
                        const nextProps = {};
                        Object.assign(nextProps, node.doc.props, props);
                        if (node.doc.componentWillReceiveProps) {
                            node.doc.componentWillReceiveProps(nextProps);
                        }
                        Object.assign(node.doc.props, nextProps);
                        node.doc.forceUpdate();
                        return node;
                    }
                    el = React.cloneElement(el, props);
                    return render();
                };
                node.toJSON = function() {
                    return toJSON(node[0]);
                };
                node.toHTML = function() {
                    return toHTML(node[0], '');
                }
                return node;
            }
            return render();
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
            options.eventHandlerPattern = '^on[A-Z_].*';
            const rx = new RegExp(options.eventHandlerPattern);
            const stubs = {};
            while (obj) {
                Object.getOwnPropertyNames(obj).forEach(name => {
                    if (rx.test(name) && !stubs[name]) {
                        stubs[name] = mokamok.stub(obj, name);
                    }
                });
                obj = obj.__proto__;
            }
            return stubs;
        }

    });
};


export function initBabel(config) {
    config.presets.push(require.resolve('babel-preset-react'));
}
