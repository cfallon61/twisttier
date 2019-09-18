import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbardemo from './components/navbar.jsx';
import Spin from './components/spin.jsx';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Home from './components/Home.js';
import Login from './components/Login.js';
import Signup from './components/Signup.js';


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
            </Switch>


          </div>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload. helllooooo
          <Spin className="spintest" username="tgul" content="Say hi to spins." timestamp="12:56 pm, 9/18/2019" />
          </p>
          <Button label="this is fun" name="b1" text="heelo" variant="primary" onClick={() => { alert('alert'); }}> button 1 </Button>
        </Router>


      </div>
    );
  }
}

export default App;
