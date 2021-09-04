import React, { Fragment, useLayoutEffect } from "react";
import { render } from "react-dom";
import { HashRouter as Router, Route, Switch} from "react-router-dom";
import { positions, Provider as AlertProvider } from "react-alert";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { makeStyles } from '@material-ui/core/styles';
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

import EmailVerified from "./accounts/EmailVerified";
import ResetPassword from "./accounts/ResetPassword";
import ResetPasswordForm from "./accounts/ResetPasswordForm";


//Alert options
const alertOptions = {
  position: positions.BOTTOM_CENTER,
  timeout: 4000,
  offset: "30px"
};

export const useStyles = makeStyles((theme) => ({
  contentContainer:{
      marginTop: theme.spacing(11),
      [theme.breakpoints.down('xs')]: {
          marginTop: theme.spacing(24)
      },
  }
}))

export function App(){

  useLayoutEffect(() => {
    store.dispatch(loadUser());
  })

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <Router basename='/'>
            <Fragment>
              <Header />
              <Alerts/>
            <div className='container'>
                <Switch>
                  <PrivateRoute exact path='/profile/:id' component={UserProfile}/>
                  <Route exact path='/' component={Dashboard} />
                    <Route path='/register' component={Register} />
                    <Route path='/reset-password/:token' component={ResetPasswordForm} />
                    <Route path='/reset-password' component={ResetPassword} />
                    
                  <Route path='/confirm/:token' component={EmailVerified}/>
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