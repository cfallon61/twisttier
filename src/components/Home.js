import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Spin from './spin.jsx';


class Home extends Component{

    constructor(props)
    {
        super(props);
        this.state = {
            loggedIn : false,
            username : ""
        };  
    }

    componentDidMount()
    {
        //Decide which page to show.
        
        
    }

    render()
    {
        return (
            <div>
                <h3>Welcome to Twister!</h3>
                <Spin className="spintest" username="tgul" content="Say hi to spins." timestamp="12:56 pm, 9/18/2019" />
            </div>
        );
    }
}

export default Home;
