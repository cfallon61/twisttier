import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import profilePic from './profilepicIcon.png';
import Image from 'react-bootstrap/Image'


class UserSettings extends Component {
  render()
  {
    return (
      <div>
        <h1> hello </h1>
        <Image src={profilePic} />
      </div>
    );
  }
}

export default UserSettings;
