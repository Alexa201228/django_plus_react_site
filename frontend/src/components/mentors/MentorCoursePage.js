import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import React, {Fragment, useEffect} from "react";
import {courseDetails} from "../../actions/courses";
import {Container, Typography} from "@material-ui/core";
import MentorCourseProgress from "./MentorCourseProgress";
import MentorLessonList from "./MentorLessonList";

export function MentorCoursePage(){
    const { slug } = useParams();
    const { course } = useSelector((state) => state.courses)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(courseDetails(slug))
    }, [slug])
    return(
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
                {course &&
                <>
                    <MentorLessonList lessons={course.course_lessons} course={course}/>
                    <MentorCourseProgress/>
                </>
                }

            </Container>
        </Fragment>

    )
}

export default MentorCoursePage;