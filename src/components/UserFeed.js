import React, {Component} from 'react';
import Feed from './feed.jsx';
import Spin from './spin.jsx';
import Profile from "./Profile.js";
import { template } from '@babel/core';
import Error from './Error.js';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown'
import Modal from './Modal.js';
import {NotificationManager} from 'react-notifications';
import App from '../App.jsx';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { body } from 'express-validator';
import "./userfeed.css";
import Speech from "react-speech";


var OperationEnum = {
    FOLLOW : 1,
    UNFOLLOW : 2
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
            interests : [],
            error : {
                exist : false, 
                message : "",
                status : ""
            },
            showFollowModal : false,
            //This is for the follow modal to keep track of the items selected.
            toFollowInterests : [],
            toUnfollowInterests : [],
            currentOperation : OperationEnum.FOLLOW
        }

        this.onFollowPressed = this.onFollowPressed.bind(this);
        this.onActionPressedAtModal = this.onActionPressedAtModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.showModal = this.showModal.bind(this);
        this.updateTagData = this.updateTagData.bind(this);
        this.addInterestToFollowList = this.addInterestToFollowList.bind(this);
        this.addInterestToUnfollowList = this.addInterestToUnfollowList.bind(this);
        this.changeOperationState = this.changeOperationState.bind(this);
        this.getViewingUser = this.getViewingUser.bind(this);

        this.userToView = this.getViewingUser();
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
            // console.log(res);
            if(res.status === 200)
            {
                //res.json also is a promise thus we attach a success callback
                res.json().then(function(jsonData){
                    const dataDict = JSON.parse(jsonData);
                    console.log(jsonData);
                    self.setState({spins : dataDict.regularposts});
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
            self.setState({error: {exist: true, message: err, status:404}});
        });
    }

    checkUserFollowings()
    {
        let user = this.getViewingUser();
        if(user === null) return;

    }

    componentDidMount()
    {
        console.log(this.username);
        this.updateUserSpins(this.username);
        this.updateTagData();
    }

    onFollowPressed()
    {
        console.log("Follow pressed.");
        this.showModal();
    }

    getViewingUser()
    {
        if(document.cookie !== "")
        {
            return document.cookie.split('=')[1];
        }
        else return null;
    }

    /**
     * 
     * @param {*} operation string that is either "Follow" or "Unfollow" 
     */
    onActionPressedAtModal(operation)
    {

        let loggedInUser = this.getViewingUser();
        let chosenList = operation === "Follow" ? this.state.toFollowInterests : this.state.toUnfollowInterests;
        let self = this;
        if(loggedInUser === null) return;
        let jsonBody = {
            action : operation.toLowerCase(),
            toFollow : this.username,
            tags : chosenList,
            follower : loggedInUser
        };
        console.log(jsonBody);
        fetch("/api/updateFollowing", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(jsonBody)
        }).then(function(res){
            if(res.status === 200)
            {
                NotificationManager.success(`${operation} successful!`);
                self.closeModal();
            }
            else{
                if(res.headers.has("error"))
                {
                    NotificationManager.error(res.headers.get('error'));
                }
                else
                {
                    NotificationManager.error("Server didn't return OK response.");
                }
            }
        });
    }

    showModal()
    {
        console.log("Showing modal...");
        this.setState({showFollowModal : true});
    }

    closeModal()
    {
        this.setState({showFollowModal : false, toFollowInterests : [], toUnfollowInterests : []});
    }

    changeOperationState(operation)
    {
        this.setState({currentOperation : operation});
    }

    onDropdownItemClicked(interest)
    {
        switch(this.state.currentOperation)
        {
            case OperationEnum.FOLLOW: this.addInterestToFollowList(interest); break;
            case OperationEnum.UNFOLLOW: this.addInterestToUnfollowList(interest); break;
            default: console.log("Error: unknown operation"); break;
        }
    }

    addInterestToFollowList(interest)
    {
        let interestList = this.state.toFollowInterests;
        if(!interestList.includes(interest))
        {
            interestList.push(interest);
            this.setState({toFollowInterests : interestList});
        }
    }

    addInterestToUnfollowList(interest)
    {
        let unfollowList = this.state.toUnfollowInterests;
        if(!unfollowList.includes(interest))
        {
            unfollowList.push(interest);
            this.setState({toUnfollowInterests : unfollowList});
        }
    }

    updateTagData()
    {
        let self = this;
        fetch(`/api/users/${this.username}`, {
            method : 'POST'
        }).then(function(response){
            if(response.status === 200)
            {
                response.json().then(function(data){
                    let jsonData = JSON.parse(data);
                    console.log(data);
                    let currentInterests = [];
                    for(var i = 0; i < jsonData.tags_associated.length; i++)
                    {
                        currentInterests.push(jsonData.tags_associated[i]);
                    }
                    self.setState({interests : currentInterests});
                });
            }
        });

    }

    renderFollowForm()
    {
        let currentOperationText = "Follow";
        switch(this.state.currentOperation)
        {
            case OperationEnum.FOLLOW: currentOperationText = "Follow"; break;
            case OperationEnum.UNFOLLOW: currentOperationText = "Unfollow"; break;
        }
        let stateDropdownView = <div>
            <h6>Current operation: {currentOperationText}</h6>
            <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                Operation
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={() => this.changeOperationState(OperationEnum.FOLLOW)}>Follow</Dropdown.Item>
                <Dropdown.Item onClick={() => this.changeOperationState(OperationEnum.UNFOLLOW)}>Unfollow</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
        </div>;

        let followItems = this.state.interests.map((tagName) => {
            return <Dropdown.Item onClick={() => this.onDropdownItemClicked(tagName)}>{tagName}</Dropdown.Item>;
        });
        let disableTagDropdown = false;
        console.log(followItems);
        if(followItems.length === 0)
        {
            disableTagDropdown = true;
        }

        let dropdownList = (
            <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                Tags
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {followItems}
            </Dropdown.Menu>
            </Dropdown>
        );

        
        let chosenList = null;
        switch(this.state.currentOperation)
        {
            case OperationEnum.FOLLOW: chosenList = this.state.toFollowInterests; break;
            case OperationEnum.UNFOLLOW: chosenList = this.state.toUnfollowInterests; break;
            default: console.log("Error: operation not defined."); break;
        }
        let addedInterestList = chosenList.map((interest) => {
            return <p>{interest}</p>;
        });

        let addedListView = (
            <div>
            <h6>Interests you decided to {currentOperationText.toLowerCase()}:</h6>
            {addedInterestList}
            </div>
        );
        let dropdownListView = null;

        if(disableTagDropdown)
        {
            dropdownListView = <h4>The user doesn't follow any tags at the moment.</h4>;
        }
        else
        {
            dropdownListView = (<div>
                                    {dropdownList}
                                    {addedListView}
                                </div>);
        }
        
        return (
            <div className="follow-form">
                {stateDropdownView}
                <h3>Which tags you want to {currentOperationText.toLowerCase()} from the user?</h3>
                {dropdownListView}
                <div className="modal-footer">
                    <Button onClick={() => this.onActionPressedAtModal(currentOperationText)}>{currentOperationText}</Button>
                    <Button onClick={this.closeModal}> Cancel </Button>
                </div>
            </div>
        );
    }

    render()
    {
        //Right now we will use three parts of the spin.
        //content, username and timestamp.
        if(this.state.error.exist) {
            return <Error message={this.state.error.message} statusCode={this.state.error.status}/>
        }
        let feed = new Feed(this.username);
        if(this.state.spins != undefined && this.state.spins.length > 0) 
        {
            for(var i = 0; i < this.state.spins.length; i++)
            {
                var spin = this.state.spins[i];
                console.log('spin =', spin);
                feed.addSpin(<Spin username={spin.username} content={spin.content} timestamp={spin.date} spinID={spin.id} userToView={this.userToView} tags={spin.tags} likes={spin.likes} likeList={spin.like_list}/>);
            }
        }
        else{
          feed.addSpin(<h6>This user currently has no spins 😢</h6>);
        }

        let followButton = null;

        //If cookie is not empty, an authenticated user entered the page.
        if(document.cookie !== "")
        {
            followButton = <Button onClick={this.onFollowPressed}>Follow &amp; Unfollow Interests</Button>;
        }

        let speechText = "You are right now checking the profile of: " + this.username;

        /**
         * The view organized by these parts:
         *          Page
         *  Left | Middle | Right
         */
        return (
            <div className="user-feed-page">
                <div className="user-feed-left">
                <Speech text={speechText} textAsButton={true} displayText="Play audio"/>
                    <Profile username={this.username}/>
                    {followButton}
                    <Modal show={this.state.showFollowModal}>
                        {this.renderFollowForm()}
                    </Modal>
                </div>
                <div className="user-feed-middle">
                    {feed.render()}
                    <footer>
                        <div>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
                    </footer>
                </div>

            </div>
        );     

    }
} 

export default UserFeed;