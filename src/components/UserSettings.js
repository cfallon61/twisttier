import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import profilePic from './profilepicIcon.png';
import Image from 'react-bootstrap/Image'


class UserSettings extends Component {

  //Get logged in user and render accordingly

  constructor(props)
  {
    super(props);
    this.state = {
      username: "",
      email:"",
      bio:"",
    }
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
        <h1> username </h1>
        <Image src={profilePic} />

        <h2>email</h2>

        <h3> bio</h3>
      </div>
    );
  }
}

export default UserSettings;
