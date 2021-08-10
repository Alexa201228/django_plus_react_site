import React, { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { connect, useDispatch, useSelector } from 'react-redux';
import { getTest } from '../../actions/tests';
import { Box, Button, Container, Typography } from '@material-ui/core';
import { Fragment } from 'react';
import { removeHTMLTags } from '../../helpers/editContentHelper';
import { useParams } from 'react-router';
import { getLesson } from '../../actions/courses';
import { Link, NavLink } from 'react-router-dom';

export function CourseLessons(){
    const { slug, lesson_slug } = useParams();
    const dispatch = useDispatch();
    const lesson = useSelector(state => state.courses.lesson)
    
    //перезапускаем useEffect только если поменялся lesson_slug
    useEffect(() => {
        dispatch(getLesson({slug, lesson_slug}))
    }, [lesson_slug])
    
    return(
        
        <Fragment>
            {lesson ?
            <Fragment>
                <Container>
                    <Typography>
                        {lesson.lesson_name}
                    </Typography>
                    <Typography>
                        {removeHTMLTags(lesson.body)}
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


export default (CourseLessons);