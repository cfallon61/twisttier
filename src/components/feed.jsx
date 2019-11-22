import React, {Component} from 'react';
import Spin from './spin.jsx';
import './feed.css';
import {NotificationManager} from 'react-notifications';

/**
 * Feed component.
 * Props: viewingUser: user that is viewing the feed.
 */
class Feed extends Component
{
    constructor(props)
    {
        super(props);
        this.state =  {
            spins : [],

        };
    }

    componentDidMount()
    {
        this.updateViewerTags(this.props.viewingUser);
    }

    addSpin(spin)
    {
        let updatedList = this.state.spins.push(spin);
        this.setState({spins: updatedList});
    } 

    updateViewerTags()
    {
        //Since "this" changes when you enter a new context, we have to keep the reference for using it inside fetch.
        const self = this;
        // console.log(`/api/users/${self.userToView}`);

        fetch(`/api/users/${this.props.viewingUser}`, {
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
                for(var i = 0; i < this.state.spins.length; i++)
                {
                    let currentSpin = this.state.spins[i];
                    console.log("Follow list: " + followingList);
                    console.log("Current spin: " + currentSpin);
                    let followedTagsFromAuthor = self.getUserTags(followingList, currentSpin.getAuthor());
                    console.log("Followed tags: " + followedTagsFromAuthor);
                    currentSpin.updateViewerTags(followedTagsFromAuthor);
                }
              })
          }
          else
          {
            if(res.headers.error)
            {
              NotificationManager.error(res.headers.error);
            }
          }
        })
        .catch(function(err){
            NotificationManager.error(err);
        })
        ;
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

    render() 
    {
        return (
            <div className="feed-area">
                {this.state.spins}
            </div>
        );
    }
}

export default Feed;