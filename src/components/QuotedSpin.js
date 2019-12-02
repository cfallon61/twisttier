import React from 'react';
import { Component } from 'react';
import Button from 'react-bootstrap/Button';
import './quotedspin.css';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import Modal from './Modal.js';
import LikeImage from './like.png';
import unlikeImage from './unlike.png';
import Image from 'react-bootstrap/Image';
import showMoreButton from "./showMore.png";
import Speech from "react-speech";
import Flame from "./flame.png";

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
 * The quoted spin component that displays username, message content and user timestamp. It is immutable, there is no state.
 */
class QuotedSpin extends Component
{
    constructor(props)
    {
        super(props);

        this.quoted = this.props.quoted || false; 
    }

    render()
    {
        let likeButton = null;
        let moreTagsButton = null;
        let tagViewList = [];
        let flameIcon = null;

        if(this.viewerIsAuthenticated())
        {
            if(this.props.showLike)
            {
                likeButton = <Button onClick={this.likeSpin} className="image-button-cover"><Image title = "Like spin" className="like-image" alt="like" src={LikeImage}/></Button>;
            }
            else
            {
                likeButton = <Button onClick={this.unlikeSpin} className="image-button-cover"><Image title = "Unlike spin" className="like-image" alt="unlike" src={unlikeImage} onClick={this.unlikeSpin}/></Button>;
            }

            /*if(this.props.tags.length === 0)
            {   
                tagViewList.push(<h6>No associated tags found.</h6>);
            }
            else
            {   
                let i = 0;
                
                while(i < MAX_TAGS && i < this.props.tags.length)
                {
                    let tagName = this.props.tags[i];
                    let view = null;

                    if (this.props.viewingUserTags !== undefined ) {
                        
                        if(this.props.viewingUserTags.includes(tagName))
                        {
                            view = <p className="followed-tags" onClick={() => this.unfollowTag(tagName)}>#{tagName}</p>;
                        }
                        else
                        {
                            view = <p className="unfollowed-tags" onClick={() => this.followTag(tagName)}>#{tagName}</p>;
                        }
                        tagViewList.push(view);
                    
                    } else {
                        view = <p className="unfollowed-tags">###{tagName}</p>;
                    }
                    i++;
 
                }
            }*/
        }

        let usernameLink  = `/profile/${this.props.username}`;
        let usernameField = <a href={usernameLink}>{this.props.username}</a>

        let speechText = this.props.username + " wrote:      " + this.props.content + "       ";
        if(this.props.tags.length > 0)
        {
            speechText += "  Added tags: ";
            for(let i = 0; i < this.props.tags.length; i++)
            {
                speechText += this.props.tags[i] + "       ";
            }
        } 
        let quotedSpin = null;
        if(this.quoted)
        {
            quotedSpin = this.props.quote;
        }

        return (
            <div className="spin-area">

                <div className="username-section">
                    <div className="username-link">
                        {usernameField}  
                    </div>
                    {flameIcon}
                    <div className="time-section">
                        <h6>
                            {this.formatDate(this.props.timestamp)}
                        </h6>
                    </div> 
                </div>
                <div className="spin-content">
                    <p>
                        {this.props.content}
                    </p>
                </div>

                <div className="other-info">
                    {likeButton} 
                    <p className="num-likes">{this.props.likes} people like this</p>
                </div>
                <Speech text={speechText} textAsButton={true} displayText="Play audio"/>
                {quotedSpin}
            </div>
        );
    }
}

export default QuotedSpin;