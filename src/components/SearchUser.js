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

const imgScale = {
    "height" : "100%",
    "width" : "100%",
    "float" : "left"
}

class SearchUser extends Component {
    constructor(props)
    {
        super(props);   
      
        this.searchName = this.props.match.params.searchName; 
        this.state = {
              users : []
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
                    console.log("Response: ", jsonData);
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
        this.getUsers(this.searchName);
    }

    render() {
      console.log("Seaching for: ", this.searchName);

      let profiles = [];
      let tempUsers = this.state.users;

      // check if users is empty  
      if (tempUsers.length === 0) {
          profiles = <h3>Could not find any user that matches your search.</h3>
      } else {
          // for each profile
          profiles = tempUsers.map( (user) => {
            
            // formulate tags of user
            let tags = [];
            if ( user.tags_associated.length === 0) {
                tags.push(<span>User does not have any associated tags yet</span>);
            } else {
                tags = user.tags_associated.map( (tag) => {
                    return  <p>
                                {tag}
                            </p>
                });
            }

            // TODO: Formulate the picture, setting default for now
            let defaultProfileView = (
                <div>
                    <img src={defaultPic} alt={user.username} style={imgScale}/>
                </div>
            );
            


            return <div className = "profile-container">
                        <div className = "profile-info">
                             {defaultProfileView}
                            <h3>{user.username}</h3>
                            <p>{tags}</p>

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