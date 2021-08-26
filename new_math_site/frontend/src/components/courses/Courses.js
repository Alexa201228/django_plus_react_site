import React, { Fragment, useEffect } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';

import { getCourses } from '../../actions/courses';

const useStyles = makeStyles((theme) => ({
    coursesContainer: {
        marginTop: theme.spacing(4),
        [theme.breakpoints.down('xs')]: {
            marginTop: theme.spacing(15)
        }
    }
})) 

export function Courses() {

    const {results} = useSelector(state => state.courses.courses)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCourses())   
    }, [])

    const style = useStyles()
    return (        
        <Fragment>
            {results && 
                <Container className={style.coursesContainer}>
                <h1>Here are Courses</h1>
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