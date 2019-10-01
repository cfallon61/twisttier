import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Spin from './spin.jsx';

class Home extends Component{

    constructor(props)
    {
        super(props);
        this.state = {
            loggedIn : false
        };  
    }

    render()
    {
        if(this.state.loggedIn)
        {
            //User timeline view
        }
        else
        {
            //Default view
            return (
                <div>
                    <Spin className="spintest" username="tgul" content="Say hi to spins." timestamp="12:56 pm, 9/18/2019" />
                </div>
            );
        }
    }
}

export default Home
