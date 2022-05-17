import React, {Fragment, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import Container from '@material-ui/core/Container';

import {Typography} from "@material-ui/core";
import axios from "axios";
import {API_PATH} from "../../helpers/requiredConst";
import {tokenConfig} from "../../actions/auth";
import {returnErrorMessages} from "../../actions/messages";


export function CourseProgress() {

    const {course} = useSelector(state => state.courses)
    const {user} = useSelector(state => state.auth);
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
                if (course.course_test?.[0] && course.course_test[0].students?.some(student => student == user.id)) {
                    const resp = await axios.get(
                        `${API_PATH}/api/tests/${course.course_test[0].id}/students/student-result?user-id=${user.id}`,
                        config
                    )
                    userMarksSum.push(resp.data.test_results?.test_mark);

                }


                for (let i = 0; i < course.course_lessons.length; i++) {
                    if (course.course_lessons[i].module_test?.[0] &&
                        course.course_lessons[i].module_test?.[0].students?.some(student => student == user.id)) {
                        const resp = await axios.get(
                            `${API_PATH}/api/tests/${course.course_lessons[i].module_test[0].id}/students/student-result?user-id=${user.id}`,
                            config
                        )
                        userMarksSum.push(resp.data.test_results?.test_mark);

                    }


                }
                let result = userMarksSum.reduce(( a, b) => a + b, 0) / userMarksSum.length
                setUserAverage(!isNaN(result) ? result : 0)

            }
            calculateAverageMark();
        }

        ,
        []
    )

    const countStudentTests = () => {
        var userTests = 0;
        if (course.course_test?.[0] && course.course_test[0].students?.some(student => student == user.id)) {
            userTests += 1;
        }
        for (var i = 0; i < course.course_lessons.length; i++) {
            if (course.course_lessons[i].module_test?.[0] &&
                course.course_lessons[i].module_test?.[0].students?.some(student => student == user.id)) {
                userTests += 1;
            }
        }

        return userTests;
    }


    return (
        <Fragment>
            <Container className={'userProgress'}>
                <Typography className={'courseProgressHeader'}>Прогресс курса</Typography>
                <Container className={'mainProgressContainer'}>
                    <Container className={'userTests'}>
                        <Typography className={'triedTests'}>Пройдено тестов:</Typography>
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


export default CourseProgress;