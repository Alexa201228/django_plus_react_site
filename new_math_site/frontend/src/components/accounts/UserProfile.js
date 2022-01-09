import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Box, CssBaseline, Typography } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import {Link, Redirect} from "react-router-dom";


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

    if (!user) {
        return <Redirect to={'/login'}/>;
    }

    const findLesson = (test_id) => {
        var slug = "";
        user.student_courses.forEach((course, _) => {
            course.course_lessons.forEach((lesson, _) => {

                if(lesson.module_test.some(t => t.id == test_id))
                    {
                        slug = `${course.slug}/${lesson.lesson_slug}`
                    }
                }
            )}
        )
        return slug
    }
    console.log(user)
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
                     `Привет, ${user.first_name}!`}
                 </Typography>
                </div>               
                <Box p={4}>
                 <Box>
                     {user.student_courses.map((course, index) => (
                         <Box
                         key={index}>
                             <Link
                             to={`/${course.slug}`}>
                                <Typography
                                 paragraph={true}>
                                 {course.title}
                             </Typography>
                             </Link>
                         </Box>
                     ))}
                 </Box>
                    <Box>
                        <Typography>Пройденные тесты:</Typography>
                        {user.student_tests.map((test, index) => (
                         <Box
                         key={index}>
                             <Link
                             to={`/${findLesson(test.id)}/${test.id}`}>
                                <Typography
                                     paragraph={true}>
                                    {test.title}
                                </Typography>
                             </Link>
                         </Box>

                     ))}
                    </Box>
             </Box>
             </Container>
            </Fragment>
        );
    }


export default UserProfile;