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
import defaultPic from "./profilepicIcon.png";
import "./searchuser.css";
import { Dropdown, DropdownButton } from 'react-bootstrap';

const imgScale = {
    "height" : "auto",
    "width" : "250px",
}

// function myModal(props) {
//     return (
//       <Modal
//         size="lg"
//         aria-labelledby="contained-modal-title-vcenter"
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title id="contained-modal-title-vcenter">
//             Tags of the user
//           </Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           <h4>Centered Modal</h4>
//           <p>
//             Tags of user
//           </p>
//         </Modal.Body>
        
//         <Modal.Footer>
//           <Button>Close</Button>
//         </Modal.Footer>
//       </Modal>
//     );
//   }

class SearchUser extends Component {
    constructor(props)
    {
        super(props);   
        
        this.state = {
              users : [],
              searchName : this.props.match.params.searchName ,
              showAllTags :  false,  
        }

        
      
      // functions
      this.getUsers = this.getUsers.bind(this);
    }

    getUsers(searchValue) {
        let self = this;
        let postURL = "/api/search/" + searchValue;
        
        fetch(postURL, {
            
            method : 'POST',
            headers : {
                "Content-Type" : "application/json"
            },

        }).then(function(res){

            if(res.status === 200)
            {
                // console.log("SUCCESFULL RESPONSE");
                res.json().then(function(data){
                    let jsonData = JSON.parse(data);
                    // console.log("Response: ", jsonData);
                    self.setState({
                        users : jsonData
                    });
                    
                });
            }
            else
            {
                if(res.headers.has('error'))
                {
                    NotificationManager.error(res.headers['error']);
                }
                else
                {
                    NotificationManager.error("Unexpected error while searching.");
                }
            }
        });
    }
     
    componentDidMount() {
        this.getUsers(this.state.searchName);
    }

    render() {
      console.log("Seaching for: ", this.state.searchName);

      let profiles = [];
      let tempUsers = this.state.users;

      // check if users is empty  
      if (tempUsers.length === 0) {
          profiles = <p>No matches found</p>

      } else {
          // for each profile
          profiles = tempUsers.map( (user) => {
            console.log("User: ", user);
            
            // formulate tags of user
            let tags = [];
            
            if ( user.tags_associated.length === 0) {
                let noItem = (  <Dropdown.Item>
                            No tags to show
                </Dropdown.Item>);
                tags.push(noItem);

            } else if ( user.tags_associated.length <= 3 ) {
                // if less than 5 tags
                tags = user.tags_associated.map( (tag) => {
                    return  <Dropdown.Item >
                            {tag}
                        </Dropdown.Item>;
                });
            } else {
                // if more than 5 tags, show 5 and show all button
                for (var i = 0; i < 4; i++) {
                    let item = (
                        <Dropdown.Item >
                            {user.tags_associated[i]}
                        </Dropdown.Item>
                    );
                    tags.push(item);   

                }
                
                let show_all_button = (
                    <Dropdown.Item >
                            {"Show All"}
                    </Dropdown.Item>
                );
                tags.push(show_all_button);
                
            }

            var userTagsDropdown = (
                <DropdownButton
                    title='User Tags'
                    variant='primary'
                >
                    {tags}
                </DropdownButton>
            );

            // TODO: Formulate the picture, setting default for now
            var chosenProfilePic = (
                    <img src={defaultPic} alt={user.username} style={imgScale}/>
            );
            // console.log("pic before check:", chosenProfilePic);

            if(user.profile_pic !== "" && user.profile_pic !== null && user.profile_pic !== "{}"){
                // console.log("IMAGE exists");
                chosenProfilePic = (
                            <img src={user.profile_pic} alt={user.username} style={imgScale}/>
                                                );

            }           

            // console.log("PIC: ", chosenProfilePic);

            return <div>
                        <div >
                            {chosenProfilePic}
                        </div>
                        <div>
                            
                            <h3>{user.username}</h3>
                            <p>{userTagsDropdown}</p>

                        </div>
                        
                    </div>

          });
      }

      
      


      return (
        <div>
            {profiles}
        </div>
      )
    }
  }
  export default withRouter(SearchUser);