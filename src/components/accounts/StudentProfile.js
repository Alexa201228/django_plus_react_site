import React, {Fragment, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Box, Typography} from '@material-ui/core';
import Container from '@material-ui/core/Container';

import {Link, Navigate} from "react-router-dom";
import './../../styles/profileStyles.css';
import {getCourses} from "../../actions/courses";


export function StudentProfile(props) {


    const {user} = useSelector(state => state.auth);
    const {courses} = useSelector(state => state.courses);

    if (!user) {
        return <Navigate to={'/student-login'}/>;
    }
    return (
        <Fragment>
            {courses.results &&
            <>
                <Container>
                    <Container className={'latestNewsContainer'}>
                        <Container>
                            <Container className={'studentsMeetingContainer'}/>
                        </Container>
                        <Container>
                            <Container className={'studentsOpportunities'}/>
                        </Container>
                        <Container>
                            <Container className={'telegramIksib'}/>
                        </Container>
                    </Container>
                    <Box p={4}>
                        <Typography className={'startedCourses'}>
                            Начатые курсы:
                        </Typography>
                        <Typography className={'startedCoursesHelpText'}>
                            Для перехода к курсу, нажмите на него
                        </Typography>
                        <Container className={'studentCoursesContainer'}>
                            {user.student_courses && user.student_courses.map((course, index) => (
                                <Container
                                    component={Link}
                                    to={`/${course.slug}`}
                                    className='courseContainer'
                                    key={index}>
                                    <Box my={3}
                                    >
                                        <Typography className={'courseTitle'}>
                                            {course.title}
                                        </Typography>
                                    </Box>
                                </Container>
                            ))}
                        </Container>
                        <Typography className={'startedCourses'}>
                            Доступные курсы:
                        </Typography>
                        <Typography className={'startedCoursesHelpText'}>
                            Для перехода к курсу, нажмите на него
                        </Typography>
                        <Container className={'studentCoursesContainer'}>
                            {courses && courses.results.map((course, index) => (
                                <Container className={'availableCourses'}
                                           component={Link}
                                           to={`/${course.slug}`}
                                           key={index}>
                                    <Typography
                                        className={'courseTitle'}>
                                        {course.title}
                                    </Typography>
                                </Container>

                            ))}
                        </Container>
                    </Box>
                </Container>
            </>
            }

        </Fragment>
    );
}


export default StudentProfile;