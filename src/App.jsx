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
import PrivateRoute from 'react-private-route';
import Error from './components/Error.js';
import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class App extends Component {

  render() {
    return (

      <div className="App">
        <Router>
          <div className="App-header">
            <Navbardemo className="Navbardemo" />
            <NotificationContainer/>
            <Switch>
              <PrivateRoute path="/" component={Home} exact isAuthenticated={true} redirect="/login" />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/userSettings" component={UserSettings} />
              <Route path="/profile/:username" component={UserFeed}/>
              <Route component={(props) => <Error message="Page cannot be found." statusCode="404"></Error>}/>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
