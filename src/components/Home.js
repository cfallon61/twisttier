import React from 'react';
import Button from 'react-bootstrap/Button';
import logo from '../logo.svg';



const Home = () => {
    return (
        <div>
            <h1>Twister</h1>
            <p>home page here</p>
            <img src={logo} className="App-logo" alt="logo" />
            <div>
                <Button label="this is fun" name="b1" text="heelo" variant="primary" onClick={()=>{ alert('alert'); }}> button 1 </Button>
            </div>
            <p className="App-intro">
                To get started, edit <code>src/App.js</code> and save to reload. hello
             </p>
        </div>
    )
}

export default Home