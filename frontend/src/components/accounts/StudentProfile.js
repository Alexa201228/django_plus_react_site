import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Box, CssBaseline, Typography } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Container from '@material-ui/core/Container';
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

export function StudentProfile(props) {

    const style = useStyles();

    const { user } = useSelector(state => state.auth);

    if (!user) {
        return <Navigate to={'/login'}/>;
    }

    const findLesson = (test_id) => {
        var slug = "";
        user.student_courses.forEach((course, _) => {
            course.course_lessons.forEach((lesson, _) => {

                if(lesson.module_test.some(t => t.id == test_id))
                    {
                        slug = `${course.slug}/${lesson.lesson_slug}`
                    }
                else if(course.course_test.some(t => t.id == test_id))
                    {
                        slug = `${course.slug}/test`
                    }
                }
            )}
        )
        return slug
    }

    const userProgress = (course) => {
        var allTestsCount = course.course_test.length;
        var passedTests = user.student_tests.length;
        for(var i = 0; i < course.course_lessons.length; i++){
            allTestsCount += course.course_lessons[i].module_test.length;
        }
        if(allTestsCount === 0){
            return null;
        }
        return `${passedTests / allTestsCount * 100}%`
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
                     `Привет, ${user.first_name}!`}
                 </Typography>
                </div>
                <Box p={4}>
                    <Typography >
                        Твои курсы:
                    </Typography>
                 <Box m={4}>
                     {user.student_courses && user.student_courses.map((course, index) => (
                         <Box className={style.coursesContainer}>
                             <Box my={3}
                             key={index}>
                                 <Link
                                 to={`/${course.slug}`}>
                                    <Typography
                                     paragraph={true}>
                                     {course.title}
                                 </Typography>
                                 </Link>
                             </Box>
                             <Box my={3}
                             key={`${course.title}${index}`}>
                                     {userProgress(course) ?
                                         <Typography>Прогресс курса: {userProgress(course)}</Typography>
                                         : null}
                             </Box>
                         </Box>
                     ))}
                 </Box>
                    <Typography>Пройденные тесты:</Typography>
                    <Box m={4}>
                        {user.student_tests && user.student_tests.map((test, index) => (
                         <Box my={3}
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


export default StudentProfile;