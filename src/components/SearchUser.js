import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { Link } from 'react-router-dom'
import Image from 'react-bootstrap/Image'
import icon_settings from './settingsIcon.png'
import icon_home from  './homeIcon.png'
import icon_twister from './twisterIcon.png'
import { withRouter } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import defaultPic from "./profilepicIcon.png";
import "./searchuser.css";
import { Dropdown, DropdownButton } from 'react-bootstrap';

const imgScale = {
    "height" : "100%",
    "width" : "100%",
    "float" : "left"
}

class SearchUser extends Component {
    constructor(props)
    {
        super(props);   
        
        this.state = {
              users : [],
              searchName : this.props.match.params.searchName   
        }

        
      
      // functions
      this.getUsers = this.getUsers.bind(this);
    }

    getUsers(searchValue) {
        let self = this;
        let postURL = "/api/search/" + searchValue;
        fetch(postURL, {
            
            method : 'POST',
            headers : {
                "Content-Type" : "application/json"
            },

        }).then(function(res){

            if(res.status === 200)
            {
                // console.log("SUCCESFULL RESPONSE");
                res.json().then(function(data){
                    let jsonData = JSON.parse(data);
                    // console.log("Response: ", jsonData);
                    self.setState({
                        users : jsonData
                    });
                    
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
                    NotificationManager.error("Unexpected error while searching.");
                }
            }
        });
    }
     
    componentDidMount() {
        console.log("Component did mount search: ", this.state.searchName);
        this.getUsers(this.state.searchName);
    }

    render() {
      console.log("Seaching for: ", this.state.searchName);

      let profiles = [];
      let tempUsers = this.state.users;

      // check if users is empty  
      if (tempUsers.length === 0) {
          profiles = <h3>Could not find any user that matches your search.</h3>
      } else {
          // for each profile
          profiles = tempUsers.map( (user) => {
            // console.log("User: ", user);
            // formulate tags of user
            let tags = [];
            if ( user.tags_associated.length === 0) {
                let noItem = (  <Dropdown.Item>
                            No tags to show
                </Dropdown.Item>);
                tags.push(noItem);

            } else {
                tags = user.tags_associated.map( (tag) => {
                    return  <Dropdown.Item >
                            {tag}
                        </Dropdown.Item>;
                });
            }

            var userTagsDropdown = (
                <DropdownButton
                    title='User Tags'
                    variant='primary'
                >
                    {tags}
                </DropdownButton>
            );





            // TODO: Formulate the picture, setting default for now
            var chosenProfilePic;
            if(user.profile_pic !== ""){

                  fetch(user.profile_pic).then(function(res)
                  {
                    // console.log('received ', res, 'from server');
                    if(res.status === 200)
                    {
                        let pic_url = res.url;

                        chosenProfilePic = (<div>
                                                <img src={pic_url} alt={user.username} style={imgScale}/>
                                            </div>);

                    }

                  });

            } else {
                chosenProfilePic = (
                    <div>
                        <img src={defaultPic} alt={user.username} style={imgScale}/>
                    </div>
                );
            }            


            return <div className = "profile-container">
                        <div className = "profile-info">
                            {chosenProfilePic}
                            <h3>{user.username}</h3>
                            <p>{userTagsDropdown}</p>

                        </div>
                        
                    </div>

          });
      }

      
      


      return (
        <div>

            {profiles}
        </div>
      )
    }
  }
  export default withRouter(SearchUser);