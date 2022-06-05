import React, {Fragment, useEffect, useState} from "react";
import Container from "@material-ui/core/Container";
import {Typography} from "@material-ui/core";
import {useSelector} from "react-redux";
import axios from "axios";
import {API_PATH} from "../../helpers/requiredConst";


export function MentorCourseProgress() {
    const {course} = useSelector(state => state.courses);
    const userState = useSelector(state => state.auth);
    const [userAverage, setUserAverage] = useState(0);

    useEffect(() => {
            async function calculateAverageMark() {
                let userMarksSum = [];
                const token = userState.access_token;
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                if (course.course_test?.[0]) {
                    for (let i = 0; i < course.course_test[0].students.length; i++) {
                        const resp = await axios.get(
                            `${API_PATH}/api/tests/${course.course_test[0].id}/students/student-result?user-id=${course.course_test[0].students[i]}`,
                            config
                        )
                        userMarksSum.push(resp.data.test_results?.test_mark);
                    }
                }


                for (let i = 0; i < course.course_lessons.length; i++) {
                    if (course.course_lessons[i].module_test[0]) {
                        for (let j = 0; j < course.course_lessons[i]?.module_test?.[0]?.students?.length; i++) {
                            console.log('students')
                            const resp = await axios.get(
                                `${API_PATH}/api/tests/${course.course_lessons[i].module_test[j].id}/students/student-result?user-id=${course.course_lessons[i].module_test[0].students[j]}`,
                                config
                            )
                            userMarksSum.push(resp.data.test_results?.test_mark);
                        }


                    }


                }
                let result = userMarksSum.reduce((a, b) => a + b, 0) / userMarksSum.length
                setUserAverage(!isNaN(result) ? result : 0)

            }

            calculateAverageMark();
        }

        ,
        [course]
    )

    const countStudentTests = () => {
        var userTests = new Set();
        if (course.course_test?.[0] && course.course_test[0].students) {
            for (let i = 0; i < course.course_test[0].students; i++) {
                if (course.course_test[0].students[i] != undefined)
                    userTests.add(course.course_test[0].students[i])
            }
        }
        for (var i = 0; i < course.course_lessons.length; i++) {
            if (course.course_lessons[i].module_test?.[0]) {
                for (let j = 0; j < course.course_lessons[i].module_test?.[0].students.length; j++) {
                    if (course.course_lessons[i].module_test[0].students[j] != undefined)
                        userTests.add(course.course_lessons[i].module_test?.[0].students[j])
                }
            }
        }
        return userTests.size;
    }


    return (
        <Fragment>
            <Container className={'userProgress'}>
                <Typography className={'courseProgressHeader'}>Прогресс курса</Typography>
                <Container className={'mainProgressContainer'}>
                    <Container className={'userTests'}>
                        <Typography className={'triedTests'}>Прошли тесты:</Typography>
                        <Typography className={'testNumber'}>{countStudentTests()}</Typography>
                    </Container>
                    <Container className={'userAverage'}>
                        <Typography className={'triedTests'}>Средний балл за выполнение тестов:</Typography>
                        <Typography className={'testAverage'}>{userAverage}</Typography>
                    </Container>
                </Container>

            </Container>
        </Fragment>
    )
}

export default MentorCourseProgress;