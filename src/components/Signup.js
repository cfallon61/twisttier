import React, {Component} from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

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
      bio : ""

    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleRepeatedPassChange = this.handleRepeatedPassChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleBioChange = this.handleBioChange.bind(this);
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
      bio : this.state.bio
    }

    fetch("/create_user", {
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json'
      },
      redirect : 'follow',
      body : JSON.stringify(writtenInfo)
    }).then(function(res){
      //Response returned.
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
        <div>
          <h1>Signup</h1>
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

                 {/* Move this section to another page (NewProfile)? */}
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

                <Button variant="primary" type="submit">Create Account</Button>
            </Form>

        </div>
    )
  }
}


export default Signup;
