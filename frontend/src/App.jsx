import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Navbardemo from './components/navbar.jsx';


class App extends Component {
  render() {
    return (

      <div className="App">
        <div className="App-header">
          <Navbardemo className="Navbardemo"/>
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload. helllooooo
        </p>
      <Button label="this is fun" name ="b1" text="heelo" variant="primary" onClick={()=>{ alert('alert'); }}> button 1 </Button>

      </div>

    );
  }
}

export default App;
