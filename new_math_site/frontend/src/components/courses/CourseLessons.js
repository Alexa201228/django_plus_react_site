import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';

import { Button, Container, Typography } from '@material-ui/core';
import renderHTML from 'react-render-html';
import { getLesson } from '../../actions/courses';
import { useStyles } from '../App';


export function CourseLesson(){
    const { slug, lesson_slug } = useParams();
    const dispatch = useDispatch();
    const {lesson} = useSelector(state => state.courses)
    const {isAuthenticated} = useSelector(state => state.auth)
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
                    {lesson.module_test && isAuthenticated  ?
                    lesson.module_test.map((test, index) => (
                        <Button
                        key={index}
                        component={NavLink}
                        to={`${lesson_slug}/${test.id}`}>        
                            {test.title}
                        </Button>          
                ))
                : <Typography>
                    Пожалуйста, войдите в свой аккаунт или зарегестрируйтесь для прохождения теста
                </Typography>}
                </Container>  
            </Fragment>
            : null}
        </Fragment>
    )
}


export default CourseLesson;