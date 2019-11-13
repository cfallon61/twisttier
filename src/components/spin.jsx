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
            newTagText : ""
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

    formatDate(timestamp)
    {
        let dateAndTime = timestamp.split('T');
        let time = dateAndTime[1].substring(0, 5);
        return dateAndTime[0] + " " + time;
    }

    deleteSpin() {
        console.log("Deleting spin");
        let deleteSpinID = this.spinID;
        let spinToBeDeleted = {"spinId" : deleteSpinID};

        // console.log("SpinID: ", spinToBeDeleted);

        // TODO:call the server function and refresh the page
        // let self = this;
        // fetch("/api/deleteSping", {

        //     method : "POST",
        //     headers : {
        //         "Content-Type" : "application/json"
        //     },
        //     body : JSON.stringify(spinToBeDeleted)

        // }).then(function(res){
        //     if(res.status === 200)
        //     {
        //         // NotificationManager.success(`You delted the spin`);
        //         window.location.reload();
        //     }
        //     else{
        //         if(res.headers.has("error"))
        //         {
        //             NotificationManager.error(res.headers.get('error'));
        //         }
        //         else
        //         {
        //             NotificationManager.error("Server didn't return OK response.");
        //         }
        //     }
        // });
    }

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



    decideAvailableActionsButton(){


        // if the post is the user's own post, return options of share, edit, and delete
        // console.log("This: ", this);
        if (this.author === this.userToView) {
            return(
                <DropdownButton
                    title='Actions'
                    variant='secondary'
                    size = "sm"
                    // id={`dropdown-variants-${variant}`}
                    // key='Info'
                >
                    <Dropdown.Item eventKey="1" active>Share</Dropdown.Item>
                    <Dropdown.Item eventKey="2" onClick = {this.showEditModal}>Edit</Dropdown.Item>
                    <Dropdown.Item eventKey="3" onClick={this.askForConfirmation}>
                        Delete
                    </Dropdown.Item>

                </DropdownButton>
            )
        }

        // if the post is someone else's only return ooption of share
        return(
            <DropdownButton
                title='Actions'
                variant='secondary'
                size = "sm"
                // id={`dropdown-variants-${variant}`}
                // key='Info'
            >
                <Dropdown.Item eventKey="1">Share</Dropdown.Item>
            </DropdownButton>
        )



    }

    // show the edit post modal
    showEditModal() {
        this.setState({showEditer : true})
    }

    // closes the edit post modal
    closeEditModal() {
        this.setState({showEditer : false})
    }

    // handles change of text for edit spin
    handleTextChange(event){
        this.setState({initialEditorValue : event.target.value});
    }

    // handles change of interest for edit spin
    handleInterestAddition(newTag) {
        let tagList = this.state.tags;

        tagList.push(newTag);

        this.setState({tags : tagList});


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
        this.setState({tags: tagList});
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

    // sends the edited post to server and refreshes the front end
    // TODO: handle server response
    handleEditPostSubmission(){
        console.log("Submitting the editted post");
    }

    // creates the components of the edit modal
    renderEditForm() {
        let spinContent = this.state.content;
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
                            value= {this.state.initialEditorValue}
                            rows="3"
                            onChange = {this.handleTextChange}
                        />
                            <p>{this.state.initialEditorValue.length}/90 characters</p>

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



    render()
    {
        // console.log("Editor bool: ", this.state.showEditer);
        // console.log("Author: ", this.author);
        // console.log("UserToView: ", this.userToView);
        let buttonToShow = null;
        let actionsButton = null;
        let tagList = [];

        if(this.viewerIsAuthenticated())
        {
            if(this.state.showLike)
            {
                buttonToShow = <Button onClick={this.likeSpin}>Like</Button>;
            }
            else
            {
                buttonToShow = <Button onClick={this.unlikeSpin}>Unlike</Button>;
            }

            if(this.state.tags.length === 0)
            {
                tagList.push(<h6>No associated tags found.</h6>);
            }
            else
            {
                // console.log(this.state.viewingUserTags);
                tagList = this.state.tags.map( (tagName) => {

                    if(this.state.viewingUserTags.includes(tagName))
                    {
                        return <Button size="sm" variant="success" onClick={() => this.unfollowTag(tagName)}>{tagName}</Button>;
                    }
                    else
                    {
                        return <Button size="sm" variant="danger" onClick={() => this.followTag(tagName)}>{tagName}</Button>;
                    }
                });
            }

            // decide what actions should be visible to the user
            actionsButton = this.decideAvailableActionsButton();


        }

        return (
            <div className="spin-area">

                <div className="username-section">
                    <div>
                        <h5>
                            {this.props.username}
                            <span class = "actionsButton">
                                {actionsButton}
                            </span>
                        </h5>

                    </div>


                </div>
                <div className="spin-content">
                    <p>
                        {this.state.content}
                    </p>
                </div>
                <div className="time-section">
                    <h6>
                        {this.formatDate(this.state.timestamp)}
                    </h6>
                </div>
                <div className="other-info">
                    <p>Likes: {this.state.likes}</p>
                </div>
                {buttonToShow}
                <div className="tags-container" style={tagContainerStyle}>
                    {tagList}
                </div>
                <Modal show = {this.state.showEditer}>
                    {this.renderEditForm()}
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
