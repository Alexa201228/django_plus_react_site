import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Box, CssBaseline, Typography } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import { loadUser } from "../../actions/auth";


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
  }));

export function UserProfile(props) {
    
    const style = useStyles();

    const { user } = useSelector(state => state.auth);
    console.log(props)

    
    if (!user) {
        return null;
    }
        return (
        <Fragment>
            <Container className={style.contentContainer}>
                <CssBaseline/>
                <div className={style.paper}>
                <Avatar className={style.avatar}>
                    <AccountCircleIcon/>
                </Avatar>
                <Typography>
                 {
                     `Welcome ${user.first_name}`}
                 </Typography>
                </div>               
                <Box p={4}>
                 <Box>
                     {user.student_courses.map((course, index) => (
                         <Box
                         key={index}>
                             <Typography
                                 paragraph={true}>
                                 {course.title}
                             </Typography>
                         </Box>
                     ))}
                 </Box>
             </Box>
             </Container>
            </Fragment>
        );
    }


export default UserProfile;