import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import './spin.css';
import PropTypes from 'prop-types';
import {NotificationManager} from 'react-notifications';
import { throwStatement } from '@babel/types';

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
            likes : 0,
            spinID : this.props.spinID,
            showLike : true,
            viewingUserTags : []
        };

        this.likeSpin = this.likeSpin.bind(this);
        this.unlikeSpin = this.unlikeSpin.bind(this);
        this.viewerIsAuthenticated = this.viewerIsAuthenticated.bind(this);

        this.userToView = this.props.userToView;
        this.author = this.props.username;
        this.spinID = this.props.spinID;

        //this.followTag = this.followTag.bind(this);
        //this.unfollowTag = this.unfollowTag.bind(this);
        this.updateViewerTags = this.updateViewerTags.bind(this);
        this.updateWhetherViewerLikedTheSpin = this.updateWhetherViewerLikedTheSpin.bind(this);
        this.getUserTags = this.getUserTags.bind(this);
    }

    /**
     * Helper method for getting tags of the author
     */
    getUserTags(followingList, author)
    {
        console.log(followingList);
        console.log(author);
        if(followingList == undefined || followingList.users.length === 0) 
        {
            console.log("Return empty");
            return [];//Empty list
        }
        console.log(followingList.users.length);
        for(var i = 0; i < followingList.users.length; i++)
        {
            if(followingList.users[i].username === author)
            {
                return followingList.users[i].tags;
            }
        }
        console.log("Return empty from end.");
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
        console.log(tagName);
        tagList.push(tagName);
        let jsonBody = {
            action : 'follow',
            toFollow : this.author,
            tags : tagList,
            follower : this.userToView
        };
        console.log(jsonBody);
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
        console.log(tagName);
        tagList.push(tagName);
        let jsonBody = {
            action : 'unfollow',
            toFollow : this.author,
            tags : tagList,
            follower : this.userToView
        };
        console.log(jsonBody);
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
        let self = this;
        console.log(this.author);
        fetch(`/api/posts/${this.author}`, {
            method : 'POST'
        }).then(function(res){
            if(res.status !== 200)
            {
                NotificationManager.error("Something went wrong while requesting from server.");
                return;
            }
            else
            {
                res.json().then(function(data)
                {
                    let jsonData = JSON.parse(data);
                    var regularposts = jsonData.regularposts;
                    // console.log('jsonData = ', jsonData);
                    console.log('regularposts =', regularposts);
                    for(var i = 0; i < regularposts.length; i++)
                    {
                      var likeList = regularposts[i].like_list;
                      console.log('likelist =', likeList);
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

    updateViewerTags()
    {
        //Since "this" changes when you enter a new context, we have to keep the reference for using it inside fetch.
        const self = this;
        console.log(`/api/users/${self.userToView}`);
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
                console.log(followingList);
                console.log(self.author);
                let followedTagsFromAuthor = self.getUserTags(followingList, self.author);
                console.log(followedTagsFromAuthor);
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

    render()
    {
        let buttonToShow = null;
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
                console.log(this.state.viewingUserTags);
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
                <div className="tags-container" style={tagContainerStyle}>
                    {tagList}
                </div>
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