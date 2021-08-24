import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Container, Typography } from '@material-ui/core';
import { Fragment } from 'react';
import renderHTML from 'react-render-html';
import { useParams } from 'react-router';
import { getLesson } from '../../actions/courses';
import {  NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
    contentContainer:{
        marginTop: theme.spacing(11),
        [theme.breakpoints.down('xs')]: {
            marginTop: theme.spacing(20)
        },
    }
}))

export function CourseLesson(){
    const { slug, lesson_slug } = useParams();
    const dispatch = useDispatch();
    const {lesson} = useSelector(state => state.courses)
    
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
                    {lesson.module_test ?
                    lesson.module_test.map((test, index) => (
                        <Button
                        key={index}
                        component={NavLink}
                        to={`${lesson_slug}/${test.id}`}>        
                            {test.title}
                        </Button>
                ))
                : null}
                </Container>  
            </Fragment>
            : null}
        </Fragment>
    )
}


export default CourseLesson;