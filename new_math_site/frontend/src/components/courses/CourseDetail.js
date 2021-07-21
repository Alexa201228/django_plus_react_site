import React, { Fragment, Component, useEffect, useState } from 'react';
import { courseDetails } from '../../actions/courses';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useLocation, useParams } from 'react-router';


export function CourseDetail(){

    let { slug } = useParams()
    const dispatch = useDispatch()
    const {courses} = useSelector(state => state.courses)
    useEffect(() => {
        dispatch(courseDetails(slug));
    }, []);

        return(
            <Fragment>
                  <h3>{courses.title}</h3> 
            </Fragment>
        )
    }



export default CourseDetail;