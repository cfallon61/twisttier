import React, {Component} from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import './LoginSignup.css'
import Container from 'react-bootstrap/Container'

const LOCAL_URL = "localhost:8080";

class Signup extends Component {

  constructor(props)
  {
    super(props);
    this.state = {
      email : "",
      password : "",
      repeatedPassword: "",
      username : "",
      name : "",
      bio : "",
      image : undefined
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleRepeatedPassChange = this.handleRepeatedPassChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleBioChange = this.handleBioChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange(event)
  {
    this.setState({email : event.target.value});
  }

  handlePasswordChange(event)
  {
    this.setState({password : event.target.value});
  }

  handleRepeatedPassChange(event)
  {
    this.setState({repeatedPassword : event.target.value});
  }

  handleUsernameChange(event)
  {
    this.setState({username : event.target.value});
  }  
  handleNameChange(event)
  {
    this.setState({name : event.target.value});
  }

  handleBioChange(event)
  {
    this.setState({bio : event.target.value});
  }

  handleImageChange(event)
  {
    this.setState({image : event.target.files[0]});
  }

  handleSubmit(event)
  {
    event.preventDefault();
    
    if(this.state.password != this.state.repeatedPassword)
    {
      //Passwords do not match.
      alert("Passwords do not match.");
      return;
    }
    let writtenInfo = {
      email : this.state.email,
      password : this.state.password,
      username : this.state.username,
      name : this.state.name,
      bio : this.state.bio,
      image : this.state.image
    }
    console.log("Submit successful");
    console.log(this.state.image);
    fetch("/create_user", {
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json'
      },
      redirect : 'follow',
      body : JSON.stringify(writtenInfo)
    }).then(function(res){
      //Response returned.
      console.log("Got response...");
      if(res.status === "406")
      {
        alert("User cannot be created.");
        return;
      }
      alert("User created.");
      window.location.href = "/login";
    }).catch(function(err){
      alert(err);
    });
  }
  render()
  {
    return (
        <div className="LoginSignup">
          <Container>
          <h1>Sign Up</h1>
            <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="formNewEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Email" onChange={this.handleEmailChange} />
                </Form.Group>

                <Form.Group controlId="formNewPasswrd">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={this.handlePasswordChange}/>
                </Form.Group>

                <Form.Group controlId="formConfirmPasswrd">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm Password" onChange={this.handleRepeatedPassChange}/>
                </Form.Group>
                 <Form.Group controlId="formNewUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="username" placeholder="Username" onChange={this.handleUsernameChange} />
                </Form.Group>

                <Form.Group controlId="formNewName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="name" placeholder="Name" onChange={this.handleNameChange}/>
                </Form.Group>

                <Form.Group controlId="formNewBio">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control type="bio" placeholder="Insert Bio Here" onChange={this.handleBioChange}/>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Profile Image</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={this.handleImageChange}/>
                </Form.Group>

                <Button variant="primary" type="submit">Create Account</Button>
            </Form>
            </Container>
        </div>
    )
  }
}


export default Signup;
