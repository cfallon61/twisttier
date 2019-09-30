import React, {Component} from 'react';
import "./profile.css";



class Profile extends Component{
    constructor(props)
    {
        super(props);
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
        var Userinfo = {
            profilePic : "",
            username : "tarcan",
            description : "This is my profile description.",
            tags : [
                "soccer", "music"
            ]
        }

        this.setState(Userinfo);
    }

    render()
    {
        //TODO: Add tags.
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

}

export default Profile;