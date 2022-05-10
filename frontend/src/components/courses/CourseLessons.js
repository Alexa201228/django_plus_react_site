import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';

import { Button, Container, Typography } from '@material-ui/core';
import renderHTML from 'react-render-html';
import { getLesson } from '../../actions/courses';
import { useStyles } from './../../App';


export function CourseLesson(){
    const { slug, lesson_slug } = useParams();
    const dispatch = useDispatch();
    const {course, lesson} = useSelector(state => state.courses)
    const {isAuthenticated, isMentor} = useSelector(state => state.auth)
    //перезапускаем useEffect только если поменялся lesson_slug
    useEffect(() => {
        dispatch(getLesson({slug, lesson_slug}))
    }, [lesson_slug])
    
    const styles = useStyles();
    return(    
        <Fragment>
            {lesson ?
            <Fragment>
                <Container className={styles.contentContainer}>
                    <Typography>
                        {lesson.lesson_name}
                    </Typography>
                    <Typography>
                        {renderHTML(lesson.body)}
                    </Typography>
                    {lesson.module_test && isAuthenticated && !isMentor ?
                    lesson.module_test.map((test, index) => (
                        <Button
                        key={index}
                        component={NavLink}
                        to={`/test/${course.slug}/${test.id}/${lesson.lesson_slug}`}>
                            {test.title}
                        </Button>          
                ))
                : <Typography m={4}>
                    Пожалуйста, войдите в свой аккаунт или зарегистрируйтесь для прохождения теста
                </Typography>}
                </Container>  
            </Fragment>
            : null}
        </Fragment>
    )
}


export default CourseLesson;