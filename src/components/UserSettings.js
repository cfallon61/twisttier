import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import profilePic from './profilepicIcon.png';
import Image from 'react-bootstrap/Image'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';


class UserSettings extends Component {

  //Get logged in user and render accordingly

  constructor(props)
  {
    super(props);
    this.state = {
      username: "",
      email:"",
      bio:"",
    };
  
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleEditBio = this.handleEditBio.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }


  handleChangeEmail(event){

  }  

  handleChangePassword(event){

  }

  handleEditBio(event){

  }

  getUserInfo(){
    fetch("/api/users/:username", {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      redirect: 'follow'
      //body
    }).then(function(res){
      //Response
      console.log("response", res);
      if(res.status === "406")
      {
        alert("butt cheeks clapped");
        return;
      }
      alert("ez clap")

    }).catch(function(err){
      alert(err);
    });

    //put values of res into the states
  }

  

  render()
  {

    
    return (
      <div>
        <Container>
          <Row>
            <Col><h1> username </h1></Col>
          </Row>
          <Row>
           <Col><Image src={profilePic} /></Col>
          </Row>
        
          <Row>
            <Col xs={10}><h2> email </h2></Col>
            <Col>
              <Button variant="secondary" onClick={this.handleChangeEmail}>Change Email</Button>
            </Col>
          </Row>
          
          <Row>
            <Col xs={10}><h3> Password </h3></Col>
            <Col>
              <Button variant="secondary" onClick={this.handleEditBio}>Change password</Button>
            </Col>
          </Row>

          <Row>
            <Col xs={10}><h3> bio </h3></Col>
            <Col>
              <Button variant="secondary" onClick={this.handleEditBio}>Edit bio</Button>
            </Col>
          </Row>

        </Container>

      </div>
    );
  }
}

export default UserSettings;
