import React from 'react';
import Child from './child';


export default class Test extends React.Component {

    constructor() {
        super();
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        console.log('CLICK');
    }

    onBlur() {
        console.log('BLUR');
    }

    render() {
        return (<div style={{ background: '#F00' }}>
            <a href="http://github.com/ggyorfi/mokamok">Mokamok</a>
            <span onClick={this.onClick}>{this.props.text}</span>
            <Child text1="A" text2="B" text3="C" onBlur={this.onBlur} />
        </div>);
    }

};
