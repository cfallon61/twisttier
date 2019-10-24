import React, {Component} from 'react';
import Spin from './spin.jsx';
import './feed.css';

class Feed extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {spins:[]};
    }

    render() 
    {
        return (
            <div className="feed-area">
                {this.state.spins}
            </div>
        );
    }

    addSpin(spin)
    {
        let updatedList = this.state.spins.push(spin);
        this.setState({spins: updatedList});
    } 
}

export default Feed;