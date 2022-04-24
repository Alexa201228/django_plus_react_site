import React, {Fragment, useEffect} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';


import Button from '@material-ui/core/Button';
import { Container, Typography } from '@material-ui/core';

import renderHTML from 'react-render-html';
import { enrollCourse } from '../../actions/courses';
import { useStyles } from './../../App';
import {useNavigate} from "react-router-dom";

export function CourseInfo(props){
    const { course } = props;
    const user = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //add course to user
    const useButtonClick = () =>{
        if(!user.isAuthenticated){
            navigate('/login');
        }
        const { title, slug } = course;
        const token = user.access_token;
        const enrollData = {
            token,
            title,
            slug
        }
        useEffect(() => {
            dispatch(enrollCourse(enrollData))
        }, [])
    }
    const styles = useStyles();
    return(
        <Fragment>
            <Container className={styles.contentContainer}>
                <h3>{course.title}</h3>
                    <Typography>
                        {renderHTML(course.description)}
                    </Typography>
                {user.user && user.user.student_courses.some(c => c.id === course.id) ?
                null
                :<Button
                    type='submit'
                    color='primary'
                    variant="contained"
                    onClick={useButtonClick}>
                    Enroll course
                    </Button>
                }
                </Container>
        </Fragment>
        
    )
}


const mapStateToProps = (state) =>({
    course: state.courses.course,
})

export default connect(mapStateToProps)(CourseInfo);