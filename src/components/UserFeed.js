import React, {Component} from 'react';
import Feed from './feed.jsx';
import Spin from './spin.jsx';

class UserFeed extends Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        //TODO: Get data from backend on which spins to show.

        //Right now we will use three parts of the spin.
        //content, username and timestamp.
        var spinExample = {
            content: "Here you go!",
            username: this.props.username,
            timestamp: "9/24/19 2:05 PM"
        };
        var spinExample2 = {
            content: "Another message!",
            username: this.props.username,
            timestamp: "9/24/19 2:20 PM"
        };
        let spinList = [spinExample, spinExample2];
        let feed = new Feed();
        for(var i = 0; i < spinList.length; i++)
        {
            var spin = spinList[i];
            console.log(spin.username);
            feed.addSpin(<Spin username={spin.username} content={spin.content} timestamp={spin.timestamp}/>);
        }
        return (
            <div className="user-feed-page">
                {feed.render()}
            </div>
        );     

    }
} 

export default UserFeed;