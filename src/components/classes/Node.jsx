import React, {Component} from "react";
//import ReactDOM from 'react-dom';

export default class Node extends Component{
    render() {
        var circleStyle = {
            width: this.props.width,
            height: this.props.height,
            borderRadius: "50%",
            background: this.props.bgc,
            position: this.props.position,
            top: this.props.y,
            left: this.props.x,
            transform: `translate(${-50}%, ${-50}%)`,
            opacity: 0.5,
            backgroundColor: "#073763ff",
        }
        return (
            <div style={circleStyle}></div>
        );
    }
}