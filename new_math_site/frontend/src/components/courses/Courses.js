import React, { Fragment, useEffect } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';

import { getCourses } from '../../actions/courses';


export function Courses() {

    const {results} = useSelector(state => state.courses.courses)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCourses())   
    }, [])

    return (        
        <Fragment>
            <h1>Here are Courses</h1>
            {results && 
            <Container>
            {results.map((course, index) => (        
                <Box
                    key={index}
                    m={3}>                    
                    <Link
                        to={`/${course.slug}`}
                    >
                        {course.title}
                    </Link>
                </Box>         
                ))}
        </Container>
        }
        </Fragment>    
    )
}


export default Courses;