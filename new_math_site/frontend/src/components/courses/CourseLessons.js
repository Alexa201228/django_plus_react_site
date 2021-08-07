import React, { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { getTest } from '../../actions/tests';
import { Box, Container, Typography } from '@material-ui/core';
import { Fragment } from 'react';
import { removeHTMLTags } from '../../helpers/editContentHelper';

export function CourseLessons(props){
    const lessons = props.course;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getTest(2))
    }, [])

    return(
        <Fragment>
            <h3>Course lessons</h3>
            <Container>
                <Box>
                    {lessons.map((lesson, index) => (
                        <Typography key={index}>
                            {removeHTMLTags(lesson.body)}
                        </Typography>
                    ))}
                </Box>
            </Container>
        </Fragment>
    )
}

CourseLessons.propTypes = {
    course: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
    course: state.courses.course.course_lessons
})

export default connect(mapStateToProps)(CourseLessons);