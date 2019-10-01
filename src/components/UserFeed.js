import React, {Component} from 'react';
import Feed from './feed.jsx';
import Spin from './spin.jsx';
import Profile from "./Profile.js";
import { template } from '@babel/core';

// Styling the user feed.
const pageStyle = {
    display: "grid",
    "grid-template-columns": "repeat(3, 1fr)"
} 

/**
 * UserFeed is the profile of a selected user.
 */
class UserFeed extends Component
{
    constructor(props)
    {
        super(props);
        let userInfo = getUserInformation(this.props.match.params.username);
        let spins = getUserSpins(this.props.match.params.username);
        this.username = this.props.match.params.username;
        this.state = {
            userinfo : userInfo,
            spins : spins
        }
        console.log(this.username);
    }

    getUserSpins()
    {
        var spinExample = {
            content: "Here you go!",
            username: this.username,
            timestamp: "9/24/19 2:05 PM"
        };
        var spinExample2 = {
            content: "Another message!",
            username: this.username,
            timestamp: "9/24/19 2:20 PM"
        };
        let spinList = [spinExample, spinExample2];

        return spinList;
    }

    render()
    {
        //Right now we will use three parts of the spin.
        //content, username and timestamp.
        
        let feed = new Feed();
        for(var i = 0; i < spinList.length; i++)
        {
            var spin = spinList[i];
            feed.addSpin(<Spin username={spin.username} content={spin.content} timestamp={spin.timestamp}/>);
        }
        /**
         * The view organized by these parts:
         *          Page
         *  Left | Middle | Right
         */
        return (
            <div className="user-feed-page" style={pageStyle}>
                <div className="user-feed-left">
                    <Profile username={this.username}/>
                </div>
                <div className="user-feed-middle">
                    {feed.render()}
                </div>
            </div>
        );     

    }
} 

export default UserFeed;