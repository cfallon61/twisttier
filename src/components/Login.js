import React, {
  Component
} from 'react';
import Nav from 'react-bootstrap/Nav';
import {
  Link
} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {
  withRouter
} from 'react-router-dom';
import './LoginSignup.css';
import Container from 'react-bootstrap/Container'

const LOCAL_URL = "localhost:8080";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleEmailChange(event) {
    this.setState({
      email: event.target.value
    });
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value
    });
  }

  /**
   * When the submit event is triggered, the properties will be in the state.
   * @param {*} event The submit event.
   */
  handleSubmit(event) {
    event.preventDefault();
    let writtenCredentials = {
      email: this.state.email,
      password: this.state.password
    };
    fetch("/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      body: JSON.stringify(writtenCredentials)
    }).then(function (res) {
      //Success!
      if (res.status === "401") {
        //TODO: Replace alert with custom feedback component.
        alert("There is no user with this email. Please sign up.");
      }
      //Redirecting to home page. 
      window.location.href = "/";
    }).catch(function (error) {
      alert(error); //This is internal errors, so it is useful to show for now.
    });
  }
  render() {
    return ( <
      div className = "LoginSignup" >
      <
      Container >
      <
      h1 > Login < /h1>

      <
      Form onSubmit = {
        this.handleSubmit
      } >
      <
      Form.Group controlId = "formBasicEmail" >
      <
      Form.Label > Email address < /Form.Label> <
      Form.Control type = "email"
      width = "50%"
      placeholder = "Email"
      onChange = {
        this.handleEmailChange
      }
      style = {
        {}
      }
      /> <
      /Form.Group>

      <
      Form.Group controlId = "formBasicPasswrd" >
      <
      Form.Label > Password < /Form.Label> <
      Form.Control type = "password"
      placeholder = "Password"
      onChange = {
        this.handlePasswordChange
      }
      /> <
      /Form.Group>

      <
      Button variant = "primary"
      type = "submit" > Login < /Button> <
      /Form> <
      Nav.Link >
      <
      Link to = "/signup" > Don 't have an account? Signup!</Link> <
      /Nav.Link> <
      /Container> <
      /div>
    );
  }

}
export default Login