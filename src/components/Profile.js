import React, {Component} from 'react';
import "./profile.css";
import {NotificationManager} from 'react-notifications';



class Profile extends Component{
    constructor(props)
    {
        super(props);
        this.username = this.props.username;
        this.state = {
            profilePic : "",
            username : this.props.username,
            bio : "",
            interests : [],
        };
    }

    componentDidMount()
    {
        //Since "this" changes when you enter a new context, we have to keep the reference for using it inside fetch.
        const self = this;
        console.log(`/api/users/${self.username}`);
        fetch(`/api/users/${self.username}`, {
            method : 'POST',
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        .then(function(res){
            console.log(res);
            if(res.status === 200)
            {
                res.json().then(function(jsonData){
                    const dataDict = JSON.parse(jsonData);
                    console.log(jsonData);
                    self.setState({bio : dataDict.bio, interests : dataDict.interests});
                }).catch(function(error){
                    self.setState({error:{exist:true, message:error, status:404}});
                });
            }
            else{
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

    render()
    {
        let tagViews = []
        console.log(this.state.interests);
        if(this.state.interests != undefined && this.state.interests.length > 0)
        {
            let currentTags = this.state.interests;
            for(var i = 0; i < currentTags.length; i++)
            {
                tagViews.push(<h6 className="tag-entry">{currentTags[i]}</h6>);
            }
        }
        
        return (
            <div className="profile-container">
                <div className="profile-info">
                    <h3>{this.state.username}</h3>
                    <h6>{this.state.bio}</h6>
                </div>
                <div className="tag-info">
                    <h4>Things I am interested</h4>
                    <div className="tag-list">
                        {tagViews}
                    </div>
                </div>
            </div>
        );
    }

    changeDescription(desc)
    {
        this.setState({bio : desc})
    }

    addTag(tag)
    {
        let updatedList = this.state.tags.push(tag);
        this.setState({tags : updatedList});
    }
}

export default Profile;