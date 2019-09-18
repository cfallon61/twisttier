import React, { Component } from 'react';
import './spin.css'

class Spin extends Component
{
    state = {
        tags: {},
        edited: false, 
        quoted: false,
        quoteThread: [],
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