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
      bio: ""
    };

    this.handleEditBio = this.handleEditBio.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    // var formdata = new FormData();
    // if(this.state.password != "")
    //   formdata.append('password', this.state.password);
    // if(this.state.bio != "")
    //   formdata.append('bio', this.state.bio);

    let body = {
      password : this.state.password,
      bio: this.state.bio
    };

    fetch(`/api/update/${this.state.username}`, {
        method : 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(body)
    }).then(function(res)
    {
      // console.log(res);
      if(res.status === 406)
      {
        NotificationManager.error("Check fields");
        return;
      }
      NotificationManager.success("Saved changes");
    });
  }


  handleDeleteAccount(event) {}

  getUserInfo() {

    var username = document.cookie.split('=')[1];
    console.log("USERNAME=", username);
    this.setState({username: username});


    //
    // fetch(`/api/users/${username}`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   redirect: "follow"
    //   //body
    // })
    //   .then(function(res) {
    //     //Response
    //     console.log("response", res);
    //     if(res.status === 200)
    //     {
    //       // res.json().then(function(jsonData){
    //       //     const dataDict = JSON.parse(jsonData);
    //       //     console.log(jsonData);
    //       // })
    //       alert('yes')
    //
    //     }
    //     if (res.status === 406) {
    //       alert("butt cheeks clapped");
    //       return;
    //     }
    //   })
    //   .catch(function(err) {
    //     alert(err);
    //   });
    //



    //put values of res into the states
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
                <Form.Group controlId="formNewBio">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control type="text" placeholder="Bio" onChange={this.handleEditBio}/>
                </Form.Group>

                <Form.Group controlId="formNewPasswrd">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={this.handlePasswordChange}/>
                </Form.Group>

                <Button variant="primary" type="submit">Save Changes</Button>
            </Form>
          </Row>
          </div>
        </Container>
      </div>
    );
  }
}

export default UserSettings;
