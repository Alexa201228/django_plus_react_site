import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useParams } from 'react-router';

import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { courseDetails } from '../../actions/courses';
import CourseLessonsList from './CourseLessonList';
import CourseLesson from './CourseLessons';
import CourseInfo from './CourseInfo';

const useStyles = makeStyles((theme) => ({
	courseContainer: {
        margin: theme.spacing(3, 0),
        padding: 0,
		display: 'flex',
        alignContent: 'flex-start',
	},
 }));

export function CourseDetail(){

    let { slug } = useParams()
    const dispatch = useDispatch()
    const { course } = useSelector(state => state.courses)
    const styles = useStyles();

    useEffect(() => {
        dispatch(courseDetails(slug));
    }, []);

        return(   
            <Fragment>{course ?
                <Fragment>
                    <Container className={styles.courseContainer}>
                        <CourseLessonsList lessons={course.course_lessons} course={course}/>
                        <Switch>
                            <Route exact path='/:slug/:lesson_slug' component={CourseLesson}/>
                            <Route path='/:slug' component={CourseInfo} />          
                        </Switch>
                    </Container>                    
                </Fragment>              
            : null}
            </Fragment> 
            
        )
}

export default CourseDetail;