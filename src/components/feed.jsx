import React, {Component} from 'react';
import {Spin} from './spin';
import './feed.css';

class Feed extends Component
{
    state = {
        spins : []
    }
    render() 
    {
        return (
            <div className="feed-area">
                {this.state.spins}
            </div>
        );
    }

    addSpin(Spin)
    {
        this.state.spins.push(Spin);
    }

}