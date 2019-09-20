import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'


const Login = () => {
    return (
        <div>
            <h1>Login</h1>
            <Form>
  <Form.Group controlId="formBasicEmail">
    <Form.Label>Email address</Form.Label>
    <Form.Control type="email" width="50%" placeholder="Email" />
  </Form.Group>

  <Form.Group controlId="formBasicPasswrd">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" placeholder="Password" />
  </Form.Group>

  <Button variant="primary" type="login">Login</Button>
</Form>


            <Nav.Link>
                <Link to="/signup">Don't have an account? Signup!</Link>
            </Nav.Link>

        </div>
    )
}

export default Login