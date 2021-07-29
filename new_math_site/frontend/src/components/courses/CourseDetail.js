import React, { Fragment, Component, useEffect, useState } from 'react';
import { courseDetails } from '../../actions/courses';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { useParams } from 'react-router';


export function CourseDetail(){

    let { slug } = useParams()
    const dispatch = useDispatch()
    const {courses} = useSelector(state => state.courses)
    const { isAuthenticated } = useSelector(state => state.auth)
    useEffect(() => {
        dispatch(courseDetails(slug));
    }, []);
    
        return(
            <Fragment>
                  <h3>{courses.title}</h3>
                    {isAuthenticated ? 
                    <Button
                    type='submit'
                    color='primary'
                    variant="contained">
                    Enroll course
                </Button>: null}
            </Fragment>
        )
    }


export default CourseDetail;