import React from 'react';


export default function Child(props) {
    return (<div>
        <ul>
            <li onBlur={props.onBlur}>{props.text1}</li>
            <li>{props.text2}</li>
            <li>{props.text3}</li>
        </ul>
    </div>);
};
