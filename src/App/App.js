import React, { Component } from 'react';
import {Router, Route, Switch} from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'


//import components
import Search from "../Search/Search.jsx"
import Detail from "../Detail/Detail.jsx"
import history from '../history.jsx';

class App extends Component {
  render() {
    return (
      
      <Router history={history}>
        <Switch>
          <Route exact path = "/" component = {Search} />
          {/* <Route exact path = "/gallery" component = {Gallery} />
          <Route exact path = "/detail" component = {Detail} /> */}
                   
                   
                    {/* Access from react router's paramter */}

          <Route exact path = '/detail/:id' component = {Detail} /> 
        </Switch>
      </Router>
    );
  }
}

export default App;
