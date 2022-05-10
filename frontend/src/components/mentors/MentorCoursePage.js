import { useLocation } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {courseDetails} from "../../actions/courses";
import {Typography} from "@material-ui/core";

export function MentorCoursePage(){
    const location = useLocation();
    const {curr_course} = location.state
    const { course } = useSelector((state) => state.courses)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(courseDetails(curr_course))
    }, [curr_course])
    console.log(course)
    return(
        <>
            Список лекций
            {course.course_lessons && course.course_lessons.map((lesson, key) => (
                <Typography
                    key={key}>
                    {lesson.lesson_name}
                </Typography>
            ))

            }
        </>
    )
}

export default MentorCoursePage;