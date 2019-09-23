import React, {Component} from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

class Signup extends Component {

  render()
  {
    return (
        <div>
          <h1>Signup</h1>
            <Form>
                <Form.Group controlId="formNewEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Email" />
                </Form.Group>

                <Form.Group controlId="formNewPasswrd">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>

                <Form.Group controlId="formConfirmPasswrd">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm Password" />
                </Form.Group>

                <Button variant="primary" type="createAccount" onSubmit={this.validateCreateAccount}>Create Account</Button>
            </Form>

        </div>
    )
  }
}


export default Signup;
