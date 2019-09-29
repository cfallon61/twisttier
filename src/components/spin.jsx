import React, { Component } from 'react';
import './spin.css'

/**
 * The spin component that displays username, message content and user timestamp.
 */
class Spin extends Component
{
    state = {
        tags: {},
        edited: false, 
        quoted: false,
        quoteOrigin: "",
        likes : 0
    };

    render()
    {
        return (
            <div className="spin-area">
                <div className="username-section">
                    <h5>
                        {this.props.username}
                    </h5>
                </div>
                <div className="spin-content">
                    <p>
                        {this.props.content}
                    </p>
                </div>
                <div className="time-section">
                    <h6>
                        {this.props.timestamp}
                    </h6>
                </div>
            </div>
        );
    }
}

export default Spin;