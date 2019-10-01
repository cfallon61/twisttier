import React, {Component} from 'react';
import "./profile.css";



class Profile extends Component{
    constructor(props)
    {
        super(props);
        this.username = this.props.username;
        this.state = {
            profilePic : "",//base64 string format
            username : this.props.username,
            description : "",
            tags : []
        };
    }

    componentDidMount()
    {
        //GET User info from server.
        let userInfo = this.getUserInformation()
        this.setState(userInfo);
    }

    getUserInformation()
    {
        return fetch(`/api/users/${this.username}`, {
            method : 'POST',
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        .then(function(res){
            if(res.status === "200")
            {
                return res.json();
            }
            else{
                if(res.headers.error)
                {
                    alert(res.headers.error);
                }
            }
        })
        .catch(function(err){
            console.log(err);
        })
        ;
    }

    render()
    {
        let tagViews = []
        let currentTags = this.state.tags;
        for(var i = 0; i < currentTags.length; i++)
        {
            tagViews.push(<h6 className="tag-entry">{currentTags[i]}</h6>)
        }

        return (
            <div className="profile-container">
                <div className="profile-info">
                    <h3>{this.state.username}</h3>
                    <h6>{this.state.description}</h6>
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
        this.setState({description : desc})
    }

    addTag(tag)
    {
        let updatedList = this.state.tags.push(tag);
        this.setState({tags : updatedList});
    }
}

export default Profile;