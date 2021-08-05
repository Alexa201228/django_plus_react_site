import React, { Fragment, useEffect } from 'react';
import { courseDetails, enrollCourse } from '../../actions/courses';
import { connect, useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { useParams, withRouter } from 'react-router';
import PropTypes from 'prop-types';


export function CourseDetail(props){

    let { slug } = useParams()
    const dispatch = useDispatch()
    const {courses} = useSelector(state => state.courses)
    useEffect(() => {
        dispatch(courseDetails(slug));
    }, []);
    console.log(courses)
    function onButtonClick(){
        if(!props.isAuthenticated){
           props.history.push('/login');
        }
        const { title, slug } = courses;
        const enrollData = {
            title,
            slug
        }
        props.enrollCourse(enrollData)
    }
        return(
            <Fragment>
                  <h3>{courses.title}</h3>
                    <Button
                    type='submit'
                    color='primary'
                    variant="contained"
                    onClick={onButtonClick}>
                    Enroll course
                </Button>
            </Fragment>
        )
    }

CourseDetail.propTypes = {
    enrollCourse: PropTypes.func,
    isAuthenticated: PropTypes.bool,
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default withRouter(connect(mapStateToProps, { enrollCourse })(CourseDetail));