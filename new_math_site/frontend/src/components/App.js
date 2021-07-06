import React, { Component, Fragment } from "react";
import { render } from "react-dom";
import { HashRouter as Router, Route, Switch, Redirect} from "react-router-dom";

import Header from './layout/Header';
import Dashboard from "./courses/Dashboard";
import Register from "./accounts/Register";
import Login from "./accounts/Login";
import PrivateRoute from "./common/PrivateRoute";

import { Provider } from 'react-redux';
import store from "../store";
import { loadUser } from "../actions/auth"

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <Fragment>
          <Header />
          <div className='container'>
              <Switch>
                <PrivateRoute exact path='/' component={Dashboard} />
                <Route exact path='/register' component={Register} />
                <Route exact path='/login' component={Login} />
            </Switch>
          </div>
        </Fragment>
        </Router>
        
      </Provider>
      
    );
  }
}

export default App;

const container = document.querySelector("#app");
render(<App/>, container); 