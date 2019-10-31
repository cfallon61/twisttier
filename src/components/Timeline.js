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
        this.username = this.props.username;
        this.state = {
            spins : [],
            error : {
                exist : false, 
                message : "",
                status : ""
            },
            showSpinModal : false,
            spin : {
                text : "",
                chars : null
            }
        };

        this.onSpinPressed = this.onSpinPressed.bind(this);
        this.onSpinPressedAtModal = this.onSpinPressedAtModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.showModal = this.showModal.bind(this);
        console.log(this.username);
    }

    componentDidMount()
    {
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
                    console.log(jsonData);
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

    handleSpinChange(event){
        this.setState({spin: {chars: event.target.value.length}});

    }

    onSpinPressed() {
        console.log("Spin pressed.");
        this.showModal();
    }

    onSpinPressedAtModal(event) {
        this.setState({spin : {text: event.target.value}} ) ;
        console.log(this.state.spin.chars);

        if(this.state.spin.chars <= 0 ){
            NotificationManager.error("Spin is too short!");
        } else if (this.state.spin.chars > 70) {
            NotificationManager.error("Spin is too long!");
        }
        //TODO: send text to server
        else {
            this.closeModal()
        }
    }

    showModal() {
        console.log("Showing spin modal...");
        this.setState({showSpinModal : true})
    }

    closeModal() {
        this.setState({showSpinModal : false})
    }

    renderSpinForm() {

        return (
            <div className="spin-form">
                    <Form onSpin = {this.handleSpin} >
                        <Form.Label>Spin</Form.Label>
                        <Form.Control as = "textarea" placeholder="Your Spin here" rows="3" 
                            onChange = {this.handleSpinChange.bind(this)}/>
                            <p>{this.state.spin.chars}/70 characters</p>
                        
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
        if(this.state.spins != undefined && this.state.spins.length > 0) 
        {
            for(var i = 0; i < this.state.spins.length; i++)
            {
                var spin = this.state.spins[i];
                feed.addSpin(<Spin username={spin.username} content={spin.content} timestamp={spin.timestamp} userID = {spin.id} userToView={this.username}/>);
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
            <div className="user-feed-page" style={pageStyle}>
                <div className="user-feed-left">
                    <Profile username={this.username}/>
                </div>
                <div className="user-feed-middle">
                    <h4>Hello {this.username}!</h4>
                    {spinButton}
                    <Modal show={this.state.showSpinModal}>
                        {this.renderSpinForm()}
                    </Modal>
                    {feed.render()}
                </div>
            </div>
        );     

    }
} 

export default Timeline;