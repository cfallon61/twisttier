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
        this.username = this.props.match.params.username;
        let spins = this.getUserSpins(this.props.match.params.username);
        this.state = {
            spins : spins
        }
        console.log(this.username);
    }

    getUserSpins(username)
    {
        fetch(`/api/posts/${username}`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            }
        }).then(function(res){
            if(res.status === "200")
            {
                return res.json();
            }
            else{
                if(res.headers.error)
                {
                    alert(res.headers.error);
                }
                else{
                    alert("Response didn't send 200.")
                }
            }
        }).catch(function(err){
            alert(err);
        });

    }

    render()
    {
        //Right now we will use three parts of the spin.
        //content, username and timestamp.
        
        let feed = new Feed();
        for(var i = 0; i < this.state.spins.length; i++)
        {
            var spin = this.state.spins[i];
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