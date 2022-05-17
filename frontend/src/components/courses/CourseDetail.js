import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useParams } from 'react-router';

import { Container } from '@material-ui/core';


import { courseDetails } from '../../actions/courses';

import CourseLesson from './CourseLessons';
import CourseInfo from './CourseInfo';

export function CourseDetail(){

    let { slug } = useParams()
    const dispatch = useDispatch()
    const { course } = useSelector(state => state.courses)

    useEffect(() => {
        dispatch(courseDetails(slug));
    }, []);

        return(   
            <Fragment>{course ?
                <Fragment>
                    <Container >
                        <Routes>
                            <Route path=':lesson_slug' element={<CourseLesson/>}/>
                            <Route path='/' element={<CourseInfo/>} />
                        </Routes>
                    </Container>                    
                </Fragment>              
            : null}
            </Fragment> 
            
        )
}

export default CourseDetail;