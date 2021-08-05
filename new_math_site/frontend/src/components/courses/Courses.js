import React, { Fragment, useEffect } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types';
import { Link, Route } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';

import { getCourses, enrollCourse } from '../../actions/courses';
import { CourseDetail } from './CourseDetail';


export function Courses(props) {

    const {results} = useSelector(state => state.courses.courses)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCourses())
        
    }, [])

    function onButtonClick(){
        const { title, slug } = courses;
        const enrollData = {
            title,
            slug
        }
        props.enrollCourse(enrollData)
    }
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

Courses.propTypes = {
    enrollCourse: PropTypes.func,
    isAuthenticated: PropTypes.bool,
}
const mapStateToProps = (state) => (
    {
        isAuthenticated: state.auth.isAuthenticated,
    }
)

export default connect(mapStateToProps, { enrollCourse })(Courses);