import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import StudentProfile from "./StudentProfile";
import {MentorMainPage} from "../mentors/MentorMainPage";
import { makeStyles } from '@material-ui/core/styles';

import {Link, Navigate} from "react-router-dom";



const useStyles = makeStyles((theme) => ({
    contentContainer: {
        [theme.breakpoints.down('xs')]: {
            marginTop: theme.spacing(28)  
          },
    },
    paper: {
      marginTop: theme.spacing(3),
      display: 'flex',
        alignItems: 'center',
        
    },
    avatar: {
      margin: theme.spacing(3),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    coursesContainer: {
        display: 'flex',
        justifyContent: 'space-between'
    },
  }));

export function UserProfile() {

    const { user, isMentor } = useSelector(state => state.auth);

    if (!user) {
        return <Navigate to={'/login'}/>;
    }
    
        return (
        <Fragment>
            {isMentor ? <MentorMainPage/> : <StudentProfile/>}
            </Fragment>
        );
    }


export default UserProfile;