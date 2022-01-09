import React, {Fragment, useEffect} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import { Container, Typography } from '@material-ui/core';

import renderHTML from 'react-render-html';
import { enrollCourse } from '../../actions/courses';
import { useStyles } from '../App';

export function CourseInfo(props){
    const { course } = props;
    const user = useSelector(state => state.auth);
    const dispatch = useDispatch();

    //add course to user
    const onButtonClick = () =>{
        if(!user.isAuthenticated){
            props.history.push('/login');
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
                {!user.user.student_courses.some(c => c.id == course.id) ?
                    <Button
                    type='submit'
                    color='primary'
                    variant="contained"
                    onClick={onButtonClick}>
                    Enroll course
                    </Button>
                : null}
                </Container>
        </Fragment>
        
    )
}


const mapStateToProps = (state) =>({
    course: state.courses.course,
})

export default connect(mapStateToProps)(CourseInfo);