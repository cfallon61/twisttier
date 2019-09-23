import React, {Component} from 'react';

const textStyle = {
    display: "block"
};

class Error extends Component {

    state = {
        message : "Unknown error.",
        statusCode : "500"
    }

    render()
    {
        return (
            <div>
                <h1 style={textStyle}>{this.state.message}</h1>
                <h3 style={textStyle}>Status Code: {this.state.statusCode}</h3>
            </div>
        );
    }

    /**
     * Sets the message and code state for the error component.
     * @param {*} message Message to update.
     * @param {*} code Status code to update.
     */
    setMessageAndStatusCode(message, code)
    {
        this.state.message = message;
        this.state.statusCode = code;
    }
}