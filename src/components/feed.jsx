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

    addSpin(Spin)
    {
        let updatedList = this.state.spins.push(Spin);
        this.setState({spins: updatedList});
    } 
}

export default Feed;