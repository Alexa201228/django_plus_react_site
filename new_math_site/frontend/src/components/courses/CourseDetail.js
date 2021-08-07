import React, { Fragment, useEffect } from 'react';
import { courseDetails, enrollCourse } from '../../actions/courses';
import { connect, useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { useParams, withRouter } from 'react-router';
import PropTypes from 'prop-types';
import CourseLessons from './CourseLessons';
import { Container, Typography } from '@material-ui/core';
import { removeHTMLTags } from '../../helpers/editContentHelper';


export function CourseDetail(props){

    let { slug } = useParams()
    const dispatch = useDispatch()
    const {course} = useSelector(state => state.courses)

    useEffect(() => {
        dispatch(courseDetails(slug));
    }, []);

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
            <Fragment>{course ?
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
                    <CourseLessons/>
                </Fragment>              
            : null}
            </Fragment> 
            
        )
    }

CourseDetail.propTypes = {
    enrollCourse: PropTypes.func,
    isAuthenticated: PropTypes.bool,
    access_token: PropTypes.string
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    access_token: state.auth.access_token
});

export default withRouter(connect(mapStateToProps, { enrollCourse })(CourseDetail));