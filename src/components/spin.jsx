import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import './spin.css';
import PropTypes from 'prop-types';
import {NotificationManager} from 'react-notifications';
import { throwStatement } from '@babel/types';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import Modal from './Modal.js';
import Form from 'react-bootstrap/Form';
import LikeImage from './like.png';
import Image from 'react-bootstrap/Image';
import editImage from './edit.png';
import shareImage from './share.png';
import deleteImage from "./delete.png";

const tagContainerStyle = {
    display: "grid",
    "grid-template-columns" : "auto auto auto auto auto",
    "align-content" : "center",
    "max-width" : "100%",
    "grid-size" : "auto",
    zIndex: 0,
    "margin" : "auto",
    "padding-top" : "2vh"
};

const MAX_TAGS = 3;

/**
 * The spin component that displays username, message content and user timestamp.
 */
class Spin extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            tags: this.props.tags,
            edited: false,
            quoted: false,
            content: this.props.content,
            timestamp: this.props.timestamp,
            quoteOrigin: "",
            likes : this.props.likes,
            spinID : this.props.spinID,
            showLike : true,
            viewingUserTags : [],
            likeList: this.props.likeList,

            // for handling the edit form modal
            
            showEditer : false,
            initialEditorValue : this.props.content,
            newTagText : "",
            showMoreTagsModal : false
        };

        this.likeSpin = this.likeSpin.bind(this);
        this.unlikeSpin = this.unlikeSpin.bind(this);
        this.viewerIsAuthenticated = this.viewerIsAuthenticated.bind(this);

        this.userToView = this.props.userToView;
        this.author = this.props.username;
        this.spinID = this.props.spinID;
        this.interestsOfUser = this.props.userInterests;

        

        //this.followTag = this.followTag.bind(this);
        //this.unfollowTag = this.unfollowTag.bind(this);
        this.updateViewerTags = this.updateViewerTags.bind(this);
        this.updateWhetherViewerLikedTheSpin = this.updateWhetherViewerLikedTheSpin.bind(this);
        this.getUserTags = this.getUserTags.bind(this);
        this.formatDate = this.formatDate.bind(this);

        // functions to delete spin
        this.deleteSpin = this.deleteSpin.bind(this);

        // functions for edit modal
        this.showEditModal = this.showEditModal.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
        this.renderEditForm = this.renderEditForm.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleInterestAddition = this.handleInterestAddition.bind(this);
        this.handleInterestDeletion = this.handleInterestDeletion.bind(this);
        this.handleNewTagTextChange = this.handleNewTagTextChange.bind(this);
        this.handNewTagAddition = this.handleNewTagAddition.bind(this);
        this.handleEditPostSubmission = this.handleEditPostSubmission.bind(this);
        this.openMoreTagsModal = this.openMoreTagsModal.bind(this);
        this.closeMoreTagsModal = this.closeMoreTagsModal.bind(this);
    }

    /**
     * Helper method for getting tags of the author
     */
    getUserTags(followingList, author)
    {
        // console.log(followingList);
        // console.log(author);
        if(followingList === undefined || followingList.users.length === 0)
        {
            console.log("Return empty");
            return [];//Empty list
        }
        // console.log(followingList.users.length);
        for(var i = 0; i < followingList.users.length; i++)
        {
            if(followingList.users[i].username === author)
            {
                return followingList.users[i].tags;
            }
        }
        // console.log("Return empty from end.");
        return [];//Empty list
    }
    
    // likes spin 
    likeSpin()
    {
        let esteemBody = {
            postAuthor: this.author,
            action: 'like',
            liker: this.userToView,
            spinID: this.spinID
        };

        let self = this;
        // console.log("Liking spin");
        fetch("/api/spins/esteem", {
            method : 'POST',
            headers : {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(esteemBody)
        }).then(function(res){
            if(res.status === 200)
            {
                res.json().then(function(data){
                    let jsonData = JSON.parse(data);
                    self.setState({likes : jsonData.likes, showLike : false});
                    NotificationManager.success('You liked the post!');
                });
            }
            else
            {
                if(res.headers.has('error'))
                {
                    NotificationManager.error(res.headers['error']);
                }
                else
                {
                    NotificationManager.error("Unexpected error while liking spin.");
                }
            }
        });
    }

    // unlikes spin
    unlikeSpin()
    {
        let esteemBody = {
            postAuthor: this.author,
            action: 'unlike',
            liker: this.userToView,
            spinID: this.spinID
        };

        let self = this;
        // console.log("Unliking spin");
        fetch("/api/spins/esteem", {
            method : 'POST',
            headers : {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(esteemBody)
        }).then(function(res){
            if(res.status === 200)
            {
                console.log("Unlike OK response");
                res.json().then(function(data){
                    console.log("Unlike sent data.");
                    let jsonData = JSON.parse(data);
                    NotificationManager.success('Unlike successful.');
                    self.setState({likes : jsonData.likes, showLike : true});

                });
            }
            else
            {
                if(res.headers.has('error'))
                {
                    NotificationManager.error(res.headers['error']);
                }
                else
                {
                    NotificationManager.error("Unexpected error while liking spin.");
                }
            }
        });
    }

    // follows tags of spins
    followTag(tagName)
    {
        let tagList = [];
        // console.log(tagName);
        tagList.push(tagName);
        let jsonBody = {
            action : 'follow',
            toFollow : this.author,
            tags : tagList,
            follower : this.userToView
        };
        // console.log(jsonBody);
        let self = this;
        fetch("/api/updateFollowing", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(jsonBody)
        }).then(function(res){
            if(res.status === 200)
            {
                NotificationManager.success(`You followed ${tagName} from ${self.author}`);
                self.updateViewerTags();
                window.location.reload();
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

    // unfollows tags of spin
    unfollowTag(tagName)
    {
        let tagList = [];
        // console.log(tagName);
        tagList.push(tagName);
        let jsonBody = {
            action : 'unfollow',
            toFollow : this.author,
            tags : tagList,
            follower : this.userToView
        };
        // console.log(jsonBody);
        let self = this;
        fetch("/api/updateFollowing", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(jsonBody)
        }).then(function(res){
            if(res.status === 200)
            {
                NotificationManager.success(`You unfollowed ${tagName} from ${self.author}`);
                self.updateViewerTags();
                window.location.reload();
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

    //Returns a boolean indicating the user already liked the spin.
    updateWhetherViewerLikedTheSpin()
    {
        if(this.state.likeList.includes(this.userToView))
        {
            this.setState({showLike : false});
        }
        else
        {
            this.setState({showLike : true});
        }
    }

    updateViewerTags()
    {
        //Since "this" changes when you enter a new context, we have to keep the reference for using it inside fetch.
        const self = this;
        // console.log(`/api/users/${self.userToView}`);
        fetch(`/api/users/${self.userToView}`, {
            method : 'POST',
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        .then(function(res)
        {
          // console.log(res);
          if(res.status === 200)
          {
            res.json().then(function(jsonData)
            {
                const dataDict = JSON.parse(jsonData);
                let followingList = dataDict.following;
                // console.log(followingList);
                // console.log(self.author);
                let followedTagsFromAuthor = self.getUserTags(followingList, self.author);
                // console.log(followedTagsFromAuthor);
                self.setState({ viewingUserTags: followedTagsFromAuthor});
              })
          }
          else
          {
            if(res.headers.error)
            {
              NotificationManager.error(res.headers.error);
              self.setState({error : res.headers.error});
            }
          }
        })
        .catch(function(err){
            console.log(err);
            self.setState({error : err});
        })
        ;
    }

    // checks whether viewer is logged in or nor
    viewerIsAuthenticated()
    {
        return document.cookie !== "";
    }

    componentDidMount()
    {
        if(this.viewerIsAuthenticated())
        {
            this.updateWhetherViewerLikedTheSpin();
            this.updateViewerTags();
        }
    }


    // formats the date
    formatDate(timestamp)
    {
        let dateAndTime = timestamp.split('T');
        let time = dateAndTime[1].substring(0, 5);
        return dateAndTime[0] + " " + time;
    }


    // deletes the spin
    deleteSpin() {
        console.log("Deleting spin");
        let deleteSpinID = this.spinID;
        let spinAuthor = this.author;
        let spinToBeDeleted = {"spinId" : deleteSpinID};

        // console.log("SpinID: ", spinToBeDeleted);
        // console.log("username: ", this.author);

        // TODO:call the server function and refresh the page
        let self = this;
        fetch("/api/deleteSpin/" + spinAuthor, {

            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(spinToBeDeleted)

        }).then(function(res){
            if(res.status === 200)
            {
                // console.log("status:", res.status);
                NotificationManager.success("Spin has been deleted");
                
                // show the notification and then delete
                setTimeout(function() { //Start the timer
                    window.location.reload();
                }.bind(this), 1000)
                
                // console.log("Spin deleted");
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

    // asks for Confirmation for delete spin
    askForConfirmation = () => {
        confirmAlert({
          title: 'Confirm to Delete',
          message: 'Are you sure you want to delete this post?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => this.deleteSpin()
            },
            {
              label: 'No',
              onClick: () => {console.log("user chose not to delete spin")}
            }
          ]
        })
    };
    

    // handles change of text for edit spin
    handleTextChange(event){
        if (event.target.value.length <= 90) {
            this.setState({
                content : event.target.value
            }); 
        }
        
    }

    // handles change of interest for edit spin
    handleInterestAddition(newTag) { 

        let tagList = this.state.tags;

        tagList.push(newTag);

        this.setState({
            tags : tagList
        });

    }

    // handles deletion of tag from the post
    handleInterestDeletion(oldTag) {

        let tagList = this.state.tags;

        // find index of the tag
        let indexOfTag = tagList.indexOf(oldTag);

        // delete the tag
        if (indexOfTag != -1) {
            tagList.splice(indexOfTag, 1);
        }
        // reset the state
        this.setState({
            tags : tagList
        });
    }

    // handles the change of text of new tag to be added
    handleNewTagTextChange(event) {
        this.setState({newTagText : event.target.value});
    }

    // handles the addition of a complete new tag
    // NOTE: different format of function used because this format does
    // create a "this" of itself and so, "this" can be used normally
    // to avoid confusion
    handleNewTagAddition = (event) => {
        event.preventDefault();
        this.handleInterestAddition(this.state.newTagText);

        // reset the newTagText
        this.setState({newTagText : ""})
    }

    // show the edit post modal
    showEditModal() {
        this.setState({showEditer : true})
        // console.log("Initial values:", this.state.initialValues);
    }

    // closes the edit post modal
    closeEditModal() {
        this.setState({            
            // close the modal
            showEditer : false
        })
        window.location.reload();
    }
    
    // sends the edited post to server and refreshes the front end
    // TODO: handle server response
    handleEditPostSubmission(){
       
        let body = {
        tags: this.state.tags,
        spinBody: this.state.content,
        spinID : this.state.spinID,
        }

        console.log(body);
        

        // send the data to server, refresh the location
        let spinAuthor = this.author;
        let self = this;
        fetch("/api/edit_spin/" + spinAuthor, {

            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(body)

        }).then(function(res){

            if(res.status === 200)
            {
                // show the notification and then close the modal
                NotificationManager.success("Spin has been edited");       

                self.setState({
                    // close the modal
                    showEditer : false
                });
                
  

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

    // creates the components of the edit modal
    renderEditForm() {
        let userInterestsCopy = this.interestsOfUser;

        // console.log("user interests after: ", userInterestsCopy);
        
        let spinInterests = [];
        
        // return all the tags the user has posted with before
        if(userInterestsCopy !== undefined)
        {
            spinInterests = userInterestsCopy.map((tagName) => {

                if (!this.state.tags.includes(tagName)){
                    return  <Dropdown.Item onClick={() => this.handleInterestAddition(tagName)}>
                            {tagName}
                            </Dropdown.Item>;
                }
            });
        }

        let userInterestsDropdown = null;
        
        // create a dropdown using those interests. If list is empty, then the view will only consist of text.
        if(spinInterests.length === 0)
        {
            userInterestsDropdown = <h3>This user don't have any interests.</h3>
        }
        else
        {
            userInterestsDropdown = (
                <DropdownButton
                    title='Suggested Tags'
                    variant='primary'
                >
                    {spinInterests}
                </DropdownButton>
            );
        }

        // show all the tags that are already associated with the spin in a dropdown
        let initialTags = this.state.tags;

        let initialTagsDropdown = [];

        if(initialTags !== undefined)
        {
            initialTagsDropdown = initialTags.map((tagName) => {
                return  <Dropdown.Item onClick={() => this.handleInterestDeletion(tagName)}>
                            {tagName}
                        </Dropdown.Item>;
            });
        }

        let addedTagsDropdown = null;
        
        if(initialTagsDropdown.length === 0)
        {
            addedTagsDropdown = <h3>This spin doesn't associate with any tags.</h3>
        }
        else
        {
            // create a dropdown using those interests
            addedTagsDropdown = (
                <DropdownButton
                    title='Tags'
                    variant='secondary'
                >
                    {initialTagsDropdown}
                </DropdownButton>
            );
        }


        return (
            <div className="spin-form">
                    <Form >
                        <Form.Label>Edit Spin</Form.Label>
                        <Form.Control 
                            as = "textarea" 
                            value= {this.state.content}
                            rows="3" 
                            onChange = {this.handleTextChange}
                        />
                            <p>{this.state.content.length}/90 characters</p>
                        
                        {userInterestsDropdown}
                        {addedTagsDropdown}
                    </Form>

                    <Form onSubmit = {this.handleNewTagAddition}>
                        <Form.Control
                            width = "40%"
                            placeholder = "Add a new tag"
                            onChange = {this.handleNewTagTextChange}
                            value = {this.state.newTagText}
                        />

                        <Button variant = "primary" type = "submit">Add tag</Button>
                    </Form>


                <div className="modal-footer">
                    <Button onClick = {this.handleEditPostSubmission}>Edit</Button>
                    <Button onClick={this.closeEditModal}>Cancel</Button>
                </div>
            </div>

        );
    }

    openMoreTagsModal()
    {
        this.setState({showMoreTagsModal : true});
    }

    closeMoreTagsModal()
    {
        this.setState({showMoreTagsModal : false});
    }

    getModalTagViews()
    {
        return this.state.tags.map((tagName) => {
            if(this.state.viewingUserTags.includes(tagName))
            {
                return <p className="followed-tags" onClick={() => this.unfollowTag(tagName)}>#{tagName}</p>;
            }
            else
            {
                return <p className="unfollowed-tags" onClick={() => this.followTag(tagName)}>#{tagName}</p>;
            }
        });
    }

    render()
    {
        // console.log("Editor bool: ", this.state.showEditer);
        // console.log("Author: ", this.author);
        // console.log("UserToView: ", this.userToView);
        let likeButton = null;
        let actionsButton = null;
        let moreTagsButton = null;
        let share_button = null;
        let edit_button = null;
        let tagViewList = [];
        let delete_button = null;

        if(this.viewerIsAuthenticated())
        {
            if(this.state.showLike)
            {
                likeButton = <button className="like-button" onClick={this.likeSpin}><Image className="like-image" src={LikeImage}/></button>;
            }
            else
            {
                likeButton = <button className="unlike-button" onClick={this.unlikeSpin}><Image className="like-image" src={LikeImage}/></button>;
            }

            if(this.state.tags.length === 0)
            {   
                tagViewList.push(<h6>No associated tags found.</h6>);
            }
            else
            {   
                let i = 0;
                
                while(i < MAX_TAGS && i < this.state.tags.length)
                {
                    let tagName = this.state.tags[i];
                    let view = null;
                    if(this.state.viewingUserTags.includes(tagName))
                    {
                        view = <p className="followed-tags" onClick={() => this.unfollowTag(tagName)}>#{tagName}</p>;
                    }
                    else
                    {
                        view = <p className="unfollowed-tags" onClick={() => this.followTag(tagName)}>#{tagName}</p>;
                    }
                    tagViewList.push(view);
                    i++;
                }

                if(this.state.tags.length > MAX_TAGS)
                {
                    moreTagsButton = <button className="more-tags-button" onClick={this.openMoreTagsModal}>...</button>;
                }

                let tagList = this.state.tags.map( (tagName) => {

                    if(this.state.viewingUserTags.includes(tagName))
                    {
                        return <p className="followed-tags" onClick={() => this.unfollowTag(tagName)}>#{tagName}</p>;
                    }
                    else
                    {
                        return <p className="unfollowed-tags" onClick={() => this.followTag(tagName)}>#{tagName}</p>;
                    }
                });
            }

            share_button = <Image 
            className="share-image" 
            src={shareImage}
            title = "Share"
            alt = "Share"
            // onClick = {this.askForConfirmation} TODO: Implement share
            />


            if (this.author === this.userToView) {
                edit_button = <Image 
                className="share-image" // using same properties
                src={editImage}
                onClick = {this.showEditModal}
                title = "Edit"
                alt = "Edit"
                />

                delete_button = <Image 
                className="share-image" // using same properties
                src={deleteImage}
                onClick = {this.askForConfirmation}
                title = "Delete"
                alt = "Delete"
                />
            }


        }

        let usernameLink  = `/profile/${this.props.username}`;
        let usernameField = <a href={usernameLink}>{this.props.username}</a>

        return (
            <div className="spin-area">

                <div className="username-section">
                    <div className="username-link">
                        {usernameField}  
                    </div>
                    <div className="time-section">
                        <h6>
                            {this.formatDate(this.state.timestamp)}
                        </h6>
                    </div> 
                </div>
                <div className="spin-content">
                    <p>
                        {this.state.content}
                    </p>
                </div>

                <div className="other-info">
                    {likeButton} 
                    <p className="num-likes">{this.state.likes}</p>
                        {delete_button}
                        {edit_button}
                        {share_button}
                </div>
                
                <div className="tags-container" style={tagContainerStyle}>
                    {tagViewList}
                    {moreTagsButton}
                </div>
                <Modal show = {this.state.showEditer}>
                    {this.renderEditForm()}
                </Modal>

                <Modal show={this.state.showMoreTagsModal}>
                    {this.getModalTagViews()}
                    <Button onClick={this.closeMoreTagsModal}>Close</Button>
                </Modal>

            </div>
        );
    }
}

Spin.propTypes = {
    username: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    spinID: PropTypes.number.isRequired,
    userToView: PropTypes.string.isRequired,
    tags: PropTypes.array.isRequired
}

export default Spin;
