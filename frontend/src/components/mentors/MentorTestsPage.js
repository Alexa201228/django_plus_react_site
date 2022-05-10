import { useLocation } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {courseDetails} from "../../actions/courses";
import {Container, Typography} from "@material-ui/core";

export function MentorTestsPage(){
    const location = useLocation();
    const {curr_course} = location.state
    const { course } = useSelector((state) => state.courses)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(courseDetails(curr_course))
    }, [curr_course])
    return(
        <>
            Список тестов:
            {course.course_test[0] ?
                <Container>
                    Тест по окончанию изучения дисциплины {course.course_test.title}
                </Container> : null}
            {course.course_lessons && course.course_lessons.map((lesson, key) => (
                lesson.module_test &&
                lesson.module_test.map((test, testKey) => (
                    <Container>
                     <Typography
                        key={`${key+testKey}`}>
                        {test.title}
                        </Typography>
                    </Container>
                    ))
            ))

            }
        </>
    )
}

export default MentorTestsPage;