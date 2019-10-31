import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import './spin.css';
import PropTypes from 'prop-types';
import {NotificationManager} from 'react-notifications';
import { throwStatement } from '@babel/types';

/**
 * The spin component that displays username, message content and user timestamp.
 */
class Spin extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            tags: {},
            edited: false, 
            quoted: false,
            content: this.props.content,
            timestamp: this.props.timestamp,
            quoteOrigin: "",
            likes : 0,
            spinID : this.props.spinID,
            showLike : true
        };

        this.likeSpin = this.likeSpin.bind(this);
        this.unlikeSpin = this.unlikeSpin.bind(this);
        this.viewerIsAuthenticated = this.viewerIsAuthenticated.bind(this);

        this.userToView = this.props.userToView;
        this.author = this.props.username;
        this.spinID = this.props.spinID;
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
        console.log("Liking spin");
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
        console.log("Unliking spin");
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
                    self.setState({likes : jsonData.likes, showLike : true});
                    NotificationManager.success('Unlike successful.');
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

    //Returns a boolean indicating the user already liked the spin.
    updateWhetherViewerLikedTheSpin()
    {
        let self = this;
        console.log(this.state.author);
        fetch(`/api/posts/${this.state.author}`, {
            method : 'POST'
        }).then(function(res){
            if(res.status !== 200)
            {
                NotificationManager.error("Something went wrong while requesting from server.");
                return;
            }
            else
            {
                res.json().then(function(data){
                    let jsonData = JSON.parse(data);
                    let likeList = jsonData.like_list;
                    for(var i = 0; i < likeList.length; i++)
                    {
                        if(likeList[i] === self.props.userToView)
                        {
                            self.setState({showLike : false});
                        }
                    }
                    self.setState({showLike : true});
                });
            
            }
        });
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
        }

    }

    render()
    {
        let buttonToShow = null;
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
        }
        let tagList = [];
        for(var i = 0; i < this.state.tags.length; i++)
        {
            tagList.push(<Button style="height: 25%; width: 25%">{this.state.tags[i]}</Button>);
        }

        return (
            <div className="spin-area">
                <div className="username-section">
                    <h5>
                        {this.props.username}
                    </h5>
                </div>
                <div className="spin-content">
                    <p>
                        {this.state.content}
                    </p>
                </div>
                <div className="time-section">
                    <h6>
                        {this.state.timestamp}
                    </h6>
                </div>
                <div className="other-info">
                    <p>Likes: {this.state.likes}</p>
                </div>
                {buttonToShow}
            </div>
        );
    }
}

Spin.propTypes = {
    username: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    spinID: PropTypes.number.isRequired,
    userToView: PropTypes.string.isRequired
}

export default Spin;