import React, {Component} from 'react';
import Feed from './feed.jsx';
import Spin from './spin.jsx';
import Profile from "./Profile.js";
import Form from 'react-bootstrap/Form';
import { template } from '@babel/core';
import Error from './Error.js';
import Button from 'react-bootstrap/Button';
import Modal from './Modal.js';
import { NotificationManager } from 'react-notifications';
import Dropdown from 'react-bootstrap/Dropdown';


/**
 * UserFeed is the profile of a selected user.
 */
class Timeline extends Component
{
    constructor(props)
    {
        super(props);
        this.username = this.props.username;
        this.state = {
            tag : "",
            spins : [],
            interests : [],
            error : {
                exist : false, 
                message : "",
                status : ""
            },
            showSpinModal : false,
            spin : {
                text : " ",
                chars : 0,
                interests : [],
            }
        };

        this.onSpinPressed = this.onSpinPressed.bind(this);
        this.onSpinPressedAtModal = this.onSpinPressedAtModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.showModal = this.showModal.bind(this);
        this.updateUserSpins = this.updateUserSpins.bind(this);
        this.addInterestToSpin = this.addInterestToSpin.bind(this);
        this.handleSpinChange = this.handleSpinChange.bind(this);
        this.handleTag = this.handleTag.bind(this);

        console.log(this.username);
    }

    componentDidMount()
    {
        this.getUserInterests();
        const self = this;
        fetch(`/api/timeline/${this.username}`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            }
        }).then(function(res){
            if(res.status === 200)
            {
                res.json().then(function(jsonData){
                    const dataDict = JSON.parse(jsonData);
                    self.setState({spins : dataDict.regularposts});
                }).catch(function(error){
                    console.log(error);
                });
            }
            else{
                self.setState({error: {exist: true, message: res.headers.error, status:res.status}});
            }
        }).catch(function(err){
            self.setState({error: {exist: true, message: err, status:"404"}});
        });
    }
    
    handleTagChange(event) {
        this.setState({tag : event.target.value});
    }

    handleTag(event){
        event.preventDefault();
        this.addInterestToSpin(this.state.tag);
    }

    onSpinPressed() {
        console.log("Spin pressed.");
        this.showModal();
    }


    onSpinPressedAtModal(event) {  
        //TODO: set interest

        if(this.state.spin.chars <= 0 ){
            NotificationManager.error("Spin is too short!");
            return;
        } else if (this.state.spin.chars > 90) {
            NotificationManager.error("Spin is too long!");
            return;
        } else if ( (this.state.spin.interests !== undefined && this.state.spin.interests.length <= 0)) {
            NotificationManager.error("Spin must have an interest!");
        }

        //TODO: send text to server
        else {
            console.log(this.state.spin.text);
            console.log(this.state.spin.interests);
            let body = {
                spinBody: this.state.spin.text,
                tags: this.state.spin.interests,
                is_quote: false,
                quote_oritin: {
                    username: this.username,
                    spinId: 'x'
                }
            };
            fetch(`/api/add_spin/${this.username}`, {
                method : 'POST',
                headers : {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(body)
            }).then(function(res){
                if(res.status === 200)
                {
                    NotificationManager.success("Spun!");
                    
                    //res.headers['error']
                }
                else
                {
                    if(res.headers.has("error"))
                    {
                        NotificationManager.error(res.headers.get('error'));
                    }
                    //Error handling
                }
            });
            this.closeModal();
        }
    }

    showModal() {
        console.log("Showing spin modal...");
        this.setState({showSpinModal : true})
    }

    closeModal() {
        this.setState({showSpinModal : false})
    }

    //when the spin text is changed, update the chars count
    handleSpinChange(event){
        this.setState({spin: {chars: event.target.value.length, text: event.target.value, interests : this.state.spin.interests}}); 
     }

    addInterestToSpin(interest) { //this needs an action listener
        let interestsList = this.state.spin.interests;
        interestsList.push(interest);
        console.log(interestsList);
        let currentText = this.state.spin.text;
        let currentChar = this.state.spin.chars;
        this.setState({spin : {interests : interestsList, chars: currentChar, text : currentText}});
    }

    getUserInterests() {
        let self = this;
        fetch(`/api/users/${this.username}`, {
            method: 'POST'
        }).then(function(response){
            if (response.status===200) {
                response.json().then(function(data){
                    let jsonData = JSON.parse(data);
                    let currentInterests = [];
                    for (var i = 0; i < jsonData.tags_associated.length; i++) {
                        currentInterests.push(jsonData.tags_associated[i]);
                    }
                    self.setState({interests : currentInterests});
                })
            }
        })
    }

    updateUserSpins() {
        NotificationManager.success(`${this.state.spin.text}`);
        //TODO
    }

    renderSpinForm() {
        console.log(this.state.spin.interests);
        let spinInterests = this.state.interests.map((tagName) => {
            return <Dropdown.Item onClick={() => this.addInterestToSpin(tagName)}>{tagName}</Dropdown.Item>
        });
        let currentAddedInterestView = [];
        if (this.state.spin.interests !== undefined) {
        currentAddedInterestView = this.state.spin.interests.map((tagName) => {
            return <h6>{tagName}</h6>;
        });
        }

        let disableInterestDropdown = false;
        console.log(spinInterests);
        if (spinInterests.length === 0) {
            disableInterestDropdown = true;
        }
        
        let dropdownInterests = (
            <Dropdown>
                <Dropdown.Toggle variant = "primary" id="dropdown-basic">
                    Tags
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {spinInterests}
                </Dropdown.Menu>
            </Dropdown>
        );
        
        let interestsDropdown = null;
        if (disableInterestDropdown){
            interestsDropdown = <h3>You need to add tags.</h3>
        } else {
            interestsDropdown = (<div>
                {dropdownInterests}
                {currentAddedInterestView}
            </div>)
        }

        return (
            <div className="spin-form">
                    <Form onSpin = {this.handleSpin} >
                        <Form.Label>Spin</Form.Label>
                        <Form.Control as = "textarea" placeholder="Your Spin here" rows="3" 
                            onChange = {this.handleSpinChange}/>
                            <p>{this.state.spin.chars}/90 characters</p>
                    </Form>
                    {interestsDropdown}
                    {this.state.spin.interests}
                    <Form>
                        
                    </Form>

                    <Form onSubmit = {this.handleTag} >
                    <Form.Control width = "40%" placeholder = "add tag" onChange = {this.handleTagChange.bind(this)}/>
                        <Button variant = "primary" type = "submit">add tag</Button>
                    </Form>
                <div className="modal-footer">
                    <Button onClick={this.onSpinPressedAtModal}>Spin</Button>
                    <Button onClick={this.closeModal}>Cancel</Button>
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
        if(this.state.spins !== undefined && this.state.spins.length > 0) 
        {
            for(var i = 0; i < this.state.spins.length; i++)
            {
                var spin = this.state.spins[i];
                feed.addSpin(<Spin username={spin.username} content={spin.content} timestamp={spin.timestamp} userID = {spin.id} userToView={this.username} tags={spin.tags} />);
            }
        }
        else{
            feed.addSpin(<h6>Follow user-tags to see spins here!</h6>);
        }

        let spinButton = <Button onClick={this.onSpinPressed}>Spin</Button>;
        
        /**
         * The view organized by these parts:
         *          Page
         *  Left | Middle | Right
         */
        return (
            <div className="user-feed-page">
                <div className="user-feed-left">
                    <Profile username={this.username}/>
                </div>
                <div className="user-feed-middle">
                    <h4>Hello {this.username}!</h4>
                    {spinButton}
                    {feed.render()}
                    <Modal show={this.state.showSpinModal}>
                        {this.renderSpinForm()}
                    </Modal>
                </div>
            </div>
        );     

    }
} 

export default Timeline;