import React, {Fragment} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';


import Button from '@material-ui/core/Button';
import {Container, Typography} from '@material-ui/core';

import {enrollCourse} from '../../actions/courses';
import {Link, useNavigate} from "react-router-dom";
import './../../styles/courseInfo.css'
import CourseLessonList from "./CourseLessonList";
import CourseProgress from "./CourseProgress";
import renderHTML from "react-render-html";

export function CourseInfo(props) {
    const {course} = props;
    const user = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //add course to user
    const useButtonClick = () => {
        if (!user.isAuthenticated) {
            navigate('/student-login');
        }
        const {title, slug} = course;
        const token = user.access_token;
        const enrollData = {
            token,
            title,
            slug
        }
        dispatch(enrollCourse(enrollData))
        navigate(`/${course.slug}`)
    }
    return (
        <Fragment>
            <Container>
                <Container className={'courseInfoContainer'}>
                    <Typography className={'courseInfoTitle'}>{course.title}</Typography>
                </Container>
                <Container
                    component={Link}
                    to={-1}
                    className={'backLinkContainer'}>
                    <Typography className={'backLinkText'}>Назад</Typography>
                </Container>
                <Container className={'lessonContentContainer'}>
                    {renderHTML(course.description)}
                </Container>
                {user.user && user.user.student_courses?.some(c => c.id === course.id) ?
                    <>
                        <CourseLessonList lessons={course.course_lessons} course={course}/>
                        <CourseProgress/>
                    </>

                    : <Button
                        className={'enrollCourseButton'}
                        type='submit'
                        onClick={useButtonClick}>
                        Записаться на курс
                    </Button>
                }
            </Container>
        </Fragment>

    )
}


const mapStateToProps = (state) => ({
    course: state.courses.course,
})

export default connect(mapStateToProps)(CourseInfo);