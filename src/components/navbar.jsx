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
import { NotificationManager } from 'react-notifications';
import { Redirect } from 'react-router';
import { selectFields } from 'express-validator/src/select-fields';
import * as DarkModeToggle from 'dark-mode-toggle';


class Navbardemo extends Component {
  constructor(props)
  {
    super(props);

    this.state = {
      searchValue : "",
      redirectToSearch : false
    }

    this.logOut = this.logOut.bind(this);
    this.onLogoutClicked = this.onLogoutClicked.bind(this);

    // search bar functions
    this.handleSearchValueChange = this.handleSearchValueChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

logOut()
  {
    fetch("/logout").then(function(res){
      if(res.status === 200)
      {
        NotificationManager.success("Logout successful");
        document.cookie = ""; //Clear cookies.
      }
      else{
        if(res.headers.has('error'))
        {
          NotificationManager.error(res.headers['error']);
        }
        else
        {
          NotificationManager.error("Unexpected error occured.");
        }
      }
    });
}

onLogoutClicked()
  {
    this.logOut();
    window.location.reload();
}

handleSearchValueChange(event) {
  event.preventDefault();
    this.setState({
        searchValue : event.target.value
    })
}

handleSubmit(event) {

}

// change the redirect bool
handleSearch(event) {
    // console.log("handling search");
    event.preventDefault();


    let url = "/searchUser/" + this.state.searchValue;
    this.props.history.push(url);

    // routing does not rerender. So force reload the page
    window.location.reload();

  }


// render component
render() {
    let dynamicView = null;
    if(this.props.loggedIn)
    {
      dynamicView = (
        <div>
          <Navbar.Collapse>
            <Link to="/">
              <Image src={icon_home}  className='icon'/>
            </Link>

            <Link to="/userSettings">
             <Image src={icon_settings}  className='icon' />
            </Link>

          </Navbar.Collapse>

          <Button variant="outline-success" onClick={this.onLogoutClicked}>Logout</Button>
        </div>
      );
    }
    else
    {
      dynamicView = <Button variant="outline-success" onClick={() => this.props.history.push("/login")}>Login</Button>
    }

    return (
      <div>
        <Navbar expand="lg">

            <Link to="/">
              <Image src={icon_twister} className='icon'/>
            </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Nav className="ml-auto">


            <Navbar.Brand id="basic-navbar-nav">
                <Form inline onSubmit = {this.handleSearch}>

                  <FormControl
                    placeholder="Search"
                    value = {this.state.searchValue}
                    onChange = {this.handleSearchValueChange}
                  />

                  <Button
                    variant="outline-success"
                    onClick = {this.handleSearch}
                  >
                      Search
                  </Button>
                </Form>
            </Navbar.Brand>
            {dynamicView}
          </Nav>
        </Navbar>
      </div>
    )
  }
}
export default withRouter(Navbardemo);
