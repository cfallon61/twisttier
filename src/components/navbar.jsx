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

class Navbardemo extends Component {
  render() {
    return (
      <div>

        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="/">Twister</Navbar.Brand>
          <Link to="/">
            <Image src={icon_twister} className='icon'/>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Nav className="ml-auto">

          <Navbar.Collapse>
          <Link to="/timeline">
          <Image src={icon_home}  className='icon'/>
          </Link>

          <Link to="/userSettings">
          <Image src={icon_settings}  className='icon' />
          </Link>
          </Navbar.Collapse>

          <Navbar.Collapse id="basic-navbar-nav">
              <Form inline>
                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-success">Search</Button>
              </Form>
              <Button variant="outline-success" onClick={() => this.props.history.push("/login")}>Log in</Button>
          </Navbar.Collapse>
          </Nav>
        </Navbar>
      </div>
    )
  }
}
export default withRouter(Navbardemo);
