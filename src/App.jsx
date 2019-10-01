import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbardemo from './components/navbar.jsx';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Home from './components/Home.js';
import Login from './components/Login.js';
import Signup from './components/Signup.js';
import UserSettings from './components/UserSettings.js';
import UserFeed from './components/UserFeed.js';

class App extends Component {

  render() {
    return (

      <div className="App">
        <Router>
          <div className="App-header">
            <Navbardemo className="Navbardemo" />
            <Switch>
              <Route path="/" component={Home} exact />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/userSettings" component={UserSettings} />
              <Route path="/profile/:username" component={UserFeed}/>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
