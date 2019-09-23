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
import icon_settings from './icon_settings.jpg'
import icon_home from  './icon_home.jpg'

class Navbardemo extends Component {
  render() {
    return (
      <div>

        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="/">Twister</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Nav className="ml-auto">

          <Link to="/timeline">
          <Image src={icon_home}  className='icon'/>
          </Link>

          <Link to="/userSettings">
          <Image src={icon_settings}  className='icon' />
          </Link>

          <Navbar.Collapse id="basic-navbar-nav">
              <Form inline>
                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-success">Search</Button>
              </Form>
          </Navbar.Collapse>

          <Nav.Link>
            <Link to="/login">Login</Link>
          </Nav.Link>

          </Nav>
        </Navbar>
      </div>
    )
  }
}
export default Navbardemo;
