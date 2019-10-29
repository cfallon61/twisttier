import React, {Component} from 'react';
import Feed from './feed.jsx';
import Spin from './spin.jsx';
import Profile from "./Profile.js";
import { template } from '@babel/core';
import Error from './Error.js';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown'
import Modal from './Modal.js';
import App from '../App.jsx';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

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
            interests : [],
            error : {
                exist : false, 
                message : "",
                status : ""
            },
            showFollowModal : false,
            //This is for the follow modal to keep track of the items selected.
            toFollowInterests : []
        }

        this.onFollowPressed = this.onFollowPressed.bind(this);
        this.onFollowPressedAtModal = this.onFollowPressedAtModal.bind(this);
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

    onFollowPressedAtModal()
    {
        //TODO
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

    addInterestToList(interest)
    {
        let interestList = this.state.toFollowInterests;
        interestList.push(interest);
        this.setState({toFollowInterests : interestList});
    }

    async getTagData()
    {
        let data = null;
        let response = await fetch(`api/users/${this.username}`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application-json'
            }
        });
        if(response.status === 200)
        {
            data = await response.json();
            console.log(data);
            return data;
        }
        else{
            return null;
        }
        
       
    }

    renderFollowForm()
    {
        let followTags = this.getTagData();
        let followItems = [];
        let disableTagDropdown = false;
        for(var i = 0; i < followTags.length; i++)
        {
            followItems.push(<Dropdown.Item>followTags[i]</Dropdown.Item>);
        }
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

        let addedInterestList = [];
        for(var i = 0; i < this.state.toFollowInterests.length; i++)
        {
            addedInterestList.push(<p>{this.state.toFollowInterests.length}</p>);
        }

        let addedListView = (
            <div>
            <h6>Interests you decided to follow:</h6>
            {addedInterestList}
            </div>
        );
        let dropdownListView = null;

        if(disableTagDropdown)
        {
            dropdownListView = <h4>The user don't follow any tags at the moment.</h4>;
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
                <h3>Which tags you want to follow from the user?</h3>
                {dropdownListView}
                <div className="modal-footer">
                    <Button onClick={this.onFollowPressedAtModal}>Follow</Button>
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
        let feed = new Feed();
        if(this.state.spins != undefined && this.state.spins.length > 0) 
        {
            for(var i = 0; i < this.state.spins.length; i++)
            {
                var spin = this.state.spins[i];
                feed.addSpin(<Spin username={this.username} content={spin.content} timestamp={spin.data} spinID={spin.id} userToView={this.username}/>);
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
                    <Modal show={this.state.showFollowModal}>
                        {this.renderFollowForm()}
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