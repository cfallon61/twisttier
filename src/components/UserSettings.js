import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "react-bootstrap/Nav";
import profilePic from "./profilepicIcon.png";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Profile from './Profile.js';
import Form from 'react-bootstrap/Form'
import {NotificationManager} from 'react-notifications';

class UserSettings extends Component {
  //Get logged in user and render accordingly

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      bio: "",
      name: "",
      profile_pic: "",
      interests: [],
      accessibility_features: ""
    };

    this.handleEditBio = this.handleEditBio.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }


  handlePasswordChange(event)
  {
    this.setState({password : event.target.value});
  }

  handleEditBio(event) {
    this.setState({bio: event.target.value});
  }

  handleSubmit(event)
  {
    event.preventDefault();
    let body = {
      "password" : this.state.password,
      "bio": this.state.bio,
      "name": this.state.name,
      "interests":this.state.interests,
      "accessibility_features": this.state.accessibility_features,
      "profile_pic": this.state.profile_pic
    };
    console.log("body", body)
    console.log("user", this.state.username)

    fetch(`/api/update/${this.state.username}`, {
        method : 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(body)
    }).then(function(res)
    {
      console.log(res);
      if(res.status === 406)
      {
        NotificationManager.error("Check fields");
        return;
      }
      NotificationManager.success("Saved changes");
    }).catch(function(error){
      console.log(error);
    }
    );
  }


  handleDeleteAccount(event) {}

  getUserInfo() {

    var username = document.cookie.split('=')[1];
    let d_bio ="";
    let d_name = "";
    let d_interests = "";
    let d_profilepic ="";
    let self = this;
    // console.log("USERNAME=", username);
    fetch(`/api/users/${username}`, {
      method: 'POST',
      headers: {
          'Content-Type' : 'application/json'
      }
    }).then(function(res){

      if(res.status === 200)
      {
        res.json().then(function(data){
            let dataDict = JSON.parse(data);
            console.log(dataDict);
            d_profilepic = dataDict.profile_pic;
            d_bio = dataDict.bio;
            d_name = dataDict.name;
            d_interests = dataDict.interests;
            self.setState({username: username, bio: d_bio, name: d_name, interests: d_interests, profile_pic: d_profilepic});

        });
      }
    });


  }
  componentDidMount()
  {
    this.getUserInfo();
  }

  render() {
    let profile = null;
    if(this.state.username !== "")
    {
      profile = <Profile username={this.state.username} />;
    }

    return (

      <div>
        <Container  >
          <Row>
            <Col>
              <h1>{this.username} </h1>
            </Col>
          </Row>
          <Row>
            <Col>
              {profile}
            </Col>
          </Row>
          <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
          <Row>
            <Form onSubmit={this.handleSubmit}>
                <Form.Group>
                    <Form.Label>Bio</Form.Label>
                    <Form.Control type="text" placeholder="Bio" onChange={this.handleEditBio}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={this.handlePasswordChange}/>
                </Form.Group>
                <Form.Group>
                  <Button variant="primary" type="submit">Save Changes</Button>
                </Form.Group>
            </Form>
          </Row>
          </div>
        </Container>
      </div>
    );
  }
}

export default UserSettings;
