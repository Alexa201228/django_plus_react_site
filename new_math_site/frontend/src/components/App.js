import React, { Component, Fragment, useLayoutEffect } from "react";
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
import CourseDetail from "./courses/CourseDetail";

import {store, persistor} from "../store";
import { loadUser } from "../actions/auth";
import TestPage from "./tests/TestPage";
import { PersistGate } from "redux-persist/integration/react";


//Alert options
const alertOptions = {
  position: positions.BOTTOM_CENTER,
  timeout: 3000,
  offset: "30px"
};

export function App(){

  useLayoutEffect(() => {
    store.dispatch(loadUser());
  })

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <Router>
            <Fragment>
              <Header />
              <Alerts/>
            <div className='container'>
                <Switch>
                  <PrivateRoute exact path='/profile/:id' component={UserProfile}/>
                  <Route exact path='/' component={Dashboard} />
                  <Route path='/register' component={Register} />
                  <Route path='/login' component={Login} />
                  <PrivateRoute path='/:slug/:lesson_slug/:test_id' component={TestPage}/>
                  <Route path='/:slug' component={CourseDetail} />
              </Switch>
            </div>
            </Fragment>
          </Router>
        </AlertProvider> 
        </PersistGate>
      </Provider> 
    );
  }

export default App;

const container = document.querySelector("#app");
render(<App/>, container); 