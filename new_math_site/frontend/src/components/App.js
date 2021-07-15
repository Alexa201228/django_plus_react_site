import React, { Component, Fragment } from "react";
import { render } from "react-dom";
import { HashRouter as Router, Route, Switch} from "react-router-dom";
import { positions, Provider as AlertProvider } from "react-alert";
import { Provider } from "react-redux";
import AlertTemplate from "react-alert-template-snackbar-material-ui";

import Header from "./layout/Header";
import Dashboard from "./courses/Dashboard";
import Alerts from "./layout/Alerts";
import Register from "./accounts/Register";
import Login from "./accounts/Login";
import PrivateRoute from "./common/PrivateRoute";
import UserProfile from "./accounts/UserProfile";


import store from "../store";
import { loadUser } from "../actions/auth";
import { getCourses } from "../actions/courses";


//Alert options
const alertOptions = {
  position: positions.TOP_CENTER,
  timeout: 5000,
  offset: "30px"
};

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
    store.dispatch(getCourses());
  }

  render() {
    return (
      <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <Router>
            <Fragment>
              <Header />
              <Alerts/>
            <div className='container'>
                <Switch>
                  <Route exact path='/' component={Dashboard} />
                  <Route exact path='/register' component={Register} />
                  <Route exact path='/login' component={Login} />
                  <PrivateRoute exact path='/user' component={UserProfile}/>
              </Switch>
            </div>
            </Fragment>
          </Router>
        </AlertProvider> 
      </Provider>
      
    );
  }
}

export default App;

const container = document.querySelector("#app");
render(<App/>, container); 