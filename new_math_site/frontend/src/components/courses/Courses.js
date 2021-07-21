import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { Link, Route, } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';

import { getCourses, courseDetails } from '../../actions/courses';
import { CourseDetail } from './CourseDetail';


export class Courses extends Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool,
        courses: PropTypes.array.isRequired,
        getCourses: PropTypes.func.isRequired,

    }

    componentDidMount() {
        this.props.getCourses();
    }

    onSubmit = () => {
        
    }

    render() {
        const courseList = this.props.courses;
        return (
            
            <Fragment>
                <h1>Here are Courses</h1>
                <Container>

                    {courseList.map((course, index) => (
                        
                        <Box
                            key={index}
                            m={3}>
                                
                            <Link
                                to={`/${course.slug}`}
                            >
                                {course.title}
                            </Link>
                            <Route path={`/:slug`}>
                                <CourseDetail/>
                            </Route>
                            {this.props.isAuthenticated ?
                                <Button
                                    type='submit'
                                    color='primary'
                                    variant="contained">
                                    Enroll course
                                </Button>
                                : null}
                        </Box>
                            
                        ))}

                </Container>
            </Fragment>
            
        )
    }
}

const mapStateToProps = (state) => (
    {
        isAuthenticated: state.auth.isAuthenticated,
        courses: state.courses.courses
    }
)

export default connect(mapStateToProps, { getCourses })(Courses);