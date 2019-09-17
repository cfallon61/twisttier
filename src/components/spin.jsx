import React, { Component } from 'react';
import './spin.css'

class Spin extends Component
{
    //Text, basic profile info, timestamp
    state = {
        content: "Something I wrote.",
        username: "TarcanGul",
        timestamp: "now"
    };

    render()
    {
        return (
            <div class="spin-area">
                <div class="username-section">
                    <h5>
                        {this.state.username}
                    </h5>
                </div>
                <div class="spin-content">
                    <p>
                        {this.state.content}
                    </p>
                </div>
                <div class="time-section">
                    <h6>
                        {this.state.timestamp}
                    </h6>
                </div>
            </div>
        );
    }
}

export default Spin;