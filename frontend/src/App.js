import React, { Fragment, useEffect } from "react";
import {BrowserRouter, Route, Routes } from "react-router-dom";
import { positions, Provider as AlertProvider } from "react-alert";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { makeStyles } from '@material-ui/core/styles';
import AlertTemplate from "react-alert-template-snackbar-material-ui";

import Header from "./components/layout/Header";
import Alerts from "./components/layout/Alerts";
import Register from "./components/accounts/Register";
import MentorLogin from "./components/accounts/MentorLogin";
import PrivateRoute from "./components/common/PrivateRoute";
import UserProfile from "./components/accounts/UserProfile";
import CourseDetail from "./components/courses/CourseDetail";

import {store, persistor} from "./store";
import { loadUser } from "./actions/auth";

import EmailVerified from "./components/accounts/EmailVerified";
import ResetPassword from "./components/accounts/ResetPassword";
import ResetPasswordForm from "./components/accounts/ResetPasswordForm";
import MainTestPage from "./components/tests/MainTestPage";
import QuestionBody from "./components/tests/QuestionBody";
import TestResults from "./components/tests/TestResults";
import './index.css';
import StudentLogin from "./components/accounts/StudentLogin";
import MentorCoursePage from "./components/mentors/MentorCoursePage";
import MentorPrivateRoute from "./components/common/MentorPrivateRoute";
import MentorTestsPage from "./components/mentors/MentorTestsPage";
import TestPrivateRoute from "./components/common/TestPrivateRoute";
import StudentTestResultPage from "./components/mentors/StudentTestResultPage";
import StudentTestAnswers from "./components/mentors/StudentTestAnswers";


//Alert options
const alertOptions = {
  position: positions.BOTTOM_CENTER,
  timeout: 4000,
  offset: "30px"
};

export const useStyles = makeStyles((theme) => ({
  contentContainer:{
      marginTop: theme.spacing(12),
  }
}))

export function App(){

  useEffect(() => {
    store.dispatch(loadUser());
  })

    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <BrowserRouter>
            <Fragment>
              <Header />
              <Alerts/>
            <div className='appContainer'>
                  <Routes>
                      <Route element={<PrivateRoute/>}>
                        <Route path={'/test/:test_id/results/test_results'} element={<TestResults/>} />
                      </Route>
                      <Route element={<TestPrivateRoute/>}>
                          <Route path='/test/:slug'>
                            <Route path={':test_id'} element={<MainTestPage/>}>
                                    <Route path={'/test/:slug/:test_id/questions/:question_id'} element={<QuestionBody/>}/>
                                   <Route path={'/test/:slug/:test_id/:lesson_slug/questions/:question_id'} element={<QuestionBody/>}/>
                            </Route>
                        </Route>
                      </Route>
                      <Route path={'/user/profile/:id'} element={<PrivateRoute/>}>
                        <Route path={'/user/profile/:id'} element={<UserProfile/>}/>
                      </Route>
                    <Route path='/' element={<StudentLogin/>}/>
                    <Route path='/register' element={<Register/>}/>
                    <Route path='/reset-password/:token' element={<ResetPasswordForm/>}/>
                    <Route path='/reset-password' element={<ResetPassword/>}/>
                      <Route element={<MentorPrivateRoute/>}>
                       <Route path='/lessons-list/:slug' element={<MentorCoursePage/>}/>
                       <Route path='/course-tests/:slug' element={<MentorTestsPage/>}/>
                       <Route path='/tests/:test_id/students' element={<StudentTestResultPage/>}/>
                       <Route path='/tests/:test_id/students/:user_id' element={<StudentTestAnswers/>}/>
                      </Route>
                      <Route element={<PrivateRoute/>}>
                       <Route path=':slug/*' element={<CourseDetail/>}/>
                      </Route>
                  <Route path='/confirm/:token' element={<EmailVerified/>} />
                  <Route path='/mentor-login' element={<MentorLogin/>} />
                  <Route path='/student-login' element={<StudentLogin/>}/>

              </Routes>
            </div>
            </Fragment>
          </BrowserRouter>
        </AlertProvider> 
        </PersistGate>
      </Provider> 
    );
  }

export default App;