import React, {Component} from 'react';
import Feed from './feed.jsx';
import Spin from './spin.jsx';
import Profile from "./Profile.js";
import { template } from '@babel/core';
import Error from './Error.js';

// Styling the user feed.
const pageStyle = {
    display: "grid",
    "grid-template-columns": "repeat(3, 1fr)"
} 

/**
 * UserFeed is the profile of a selected user.
 */
class Timeline extends Component
{
    constructor(props)
    {
        super(props);
        let spins = this.getTimelineSpins(this.props.username);
        this.state = {
            spins : spins,
            error : {
                exist : false, 
                errorMessage : "",
                status : ""
            }
        }
        console.log(this.username);
    }

    getUserSpins(username)
    {
        fetch(`/api/timeline/${username}`, {
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
                this.setState({error: {exist: true, message: res.headers.error, status:res.status}});
            }
        }).catch(function(err){
            this.setState({error: {exist: true, message: err, status:"404"}});
        });

    }

    render()
    {
        //Right now we will use three parts of the spin.
        //content, username and timestamp.
        if(this.state.error.exist) {
            return <Error message={this.state.error.message} statusCode={this.state.error.status}/>
        }
        let feed = new Feed();
        if(this.state.spins != undefined && this.state.spins.length > 0) 
        {
            for(var i = 0; i < this.state.spins.length; i++)
            {
                var spin = this.state.spins[i];
                feed.addSpin(<Spin username={spin.username} content={spin.content} timestamp={spin.timestamp}/>);
            }
        }
        else{
            feed.addSpin(<h6>This user currently has no spins...</h6>);
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

export default Timeline;