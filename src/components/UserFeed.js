import React, {Component} from 'react';
import Feed from './feed.jsx';
import Spin from './spin.jsx';
import Profile from "./Profile.js";
import { template } from '@babel/core';
import Error from './Error.js';
import Button from 'react-bootstrap/Button';
import Modal from './Modal.js';
import App from '../App.jsx';

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
        this.state = {
            spins : [],
            error : {
                exist : false, 
                message : "",
                status : ""
            },
            showFollowModal : false
        }

        this.onFollowPressed = this.onFollowPressed.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.showModal = this.showModal.bind(this);
    }

    updateUserSpins(username)
    {
        //Since "this" changes when you enter a new context, we have to keep the reference for using it inside fetch.
        const self = this;
        console.log("Fetching...");
        fetch(`/api/posts/${username}`, {
            method: "POST",
            credentials: 'same-origin'
        }).then(function(res){
            console.log(res);
            if(res.status === 200)
            {
                //res.json also is a promise thus we attach a success callback
                res.json().then(function(jsonData){
                    const dataDict = JSON.parse(jsonData);
                    console.log(jsonData);
                    self.setState({spins : dataDict});
                }).catch(function(error){
                    self.setState({error:{exist:true, message:error, status:404}});
                });
                
            }
            else{
                self.setState({error: {exist: true, message: res.headers.error, status:res.status}});
                console.log(res.headers.error);
            }
        }).catch(function(err){
            console.log(err);
            this.setState({error: {exist: true, message: err, status:404}});
        });

    }

    componentDidMount()
    {
        console.log(this.username);
        this.updateUserSpins(this.username);
    }

    onFollowPressed()
    {
        console.log("Follow pressed.");
        this.showModal();
    }

    showModal()
    {
        console.log("Showing modal...");
        this.setState({showFollowModal : true});
    }

    closeModal()
    {
        this.setState({showFollowModal : false});
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
                feed.addSpin(<Spin username={this.username} content={spin.content} timestamp={spin.data}/>);
            }
        }
        else{
            feed.addSpin(<h6>This user currently has no spins...</h6>);
        }

        let followButton = null;

        //If cookie is not empty, an authenticated user entered the page.
        if(document.cookie !== "")
        {
            followButton = <Button onClick={this.onFollowPressed}>Follow</Button>;
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
                    {followButton}
                    <Modal show={this.state.showFollowModal} onClose={this.closeModal}>
                        <p>Example modal.</p>
                    </Modal>
                </div>
                <div className="user-feed-middle">
                    {feed.render()}
                </div>

            </div>
        );     

    }
} 

export default UserFeed;