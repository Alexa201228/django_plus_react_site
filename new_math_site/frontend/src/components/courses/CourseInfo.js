import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Fragment } from 'react';

import Button from '@material-ui/core/Button';
import { Container, Typography } from '@material-ui/core';

import { removeHTMLTags } from '../../helpers/editContentHelper';
import { enrollCourse } from '../../actions/courses';


export function CourseInfo(props){
    const { course } = props;

    //add course to user
    function onButtonClick(){
        if(!props.isAuthenticated){
            props.history.push('/login');
        }
        const { title, slug } = course;
        const token = props.access_token;
        const enrollData = {
            token,
            title,
            slug
        }
        props.enrollCourse(enrollData)
    }

    return(
        <Fragment>
            <Container>
                <h3>{course.title}</h3>
                    <Typography>
                        {removeHTMLTags(course.description)}
                    </Typography>
                    <Button
                    type='submit'
                    color='primary'
                    variant="contained"
                    onClick={onButtonClick}>
                    Enroll course
                    </Button>
                </Container>
        </Fragment>
        
    )
}

CourseInfo.propTypes = {
    enrollCourse: PropTypes.func,
    isAuthenticated: PropTypes.bool,
    access_token: PropTypes.string
}

const mapStateToProps = (state) =>({
    course: state.courses.course,
    isAuthenticated: state.auth.isAuthenticated,
    access_token: state.auth.access_token
})

export default connect(mapStateToProps, { enrollCourse })(CourseInfo);