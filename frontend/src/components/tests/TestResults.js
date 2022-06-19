import {useParams} from 'react-router';
import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect, useDispatch, useSelector} from 'react-redux';

import {Box, Container, Typography, Button, MenuItem} from '@material-ui/core';

import {getJustTest, getTest, getUserTestAnswers, tryTestAgain} from '../../actions/tests';
import renderHTML from "react-render-html";
import {Link, useNavigate} from "react-router-dom";
import {Dropdown} from "react-bootstrap";
import {formatSeconds} from "../../helpers/timerComponent";
import axios from "axios";
import {API_PATH} from "../../helpers/requiredConst";
import {TRY_TEST_AGAIN} from "../../actions/types";
import {returnErrorMessages} from "../../actions/messages";


export function TestResults(props) {
    const {test, user_test_answers} = useSelector(state => state.tests);
    const {course, lesson} = useSelector(state => state.courses);
    const {user} = useSelector(state => state.auth);
    const {test_id} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getUserTestAnswers(test_id, user.id));
        dispatch(getJustTest(test_id))
        localStorage.removeItem('testTime')
    }, [test_id, user])

    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
        window.history.go(1);
    };
    const tryAgain = () => {
        localStorage.removeItem('testTime')
        const token = user.access_token;
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        axios.get(
            `${API_PATH}/api/tests/${test_id}/try-again`,
            config
        )
            .then(res => {
                if (lesson) {
                    navigate(`/test/${course.slug}/${lesson.lesson_slug}/${test_id}/questions/${test.questions_on_test[0].id}`);
                }
                navigate(`/test/${course.slug}/${test_id}/questions/${test.questions_on_test[0].id}`)
                dispatch({
                    type: TRY_TEST_AGAIN,
                    payload: res.data
                })

            })
            .catch(err => {
                if (err.response.status === 401) {
                    return null;
                } else {
                    dispatch(returnErrorMessages({error: err.response.data}, {status: err.response.status}))
                }
            });

    }
    const getRightAnswer = (question) => {
        let rightAnswer = [];
        for (let i = 0; i < question?.answers_to_question?.length; i++) {
            if (question?.answers_to_question?.[i].is_correct) {
                rightAnswer.push(question?.answers_to_question?.[i].answer_body)
            }
        }
        return rightAnswer;
    }

    const getUserAnswer = (question) => {
        let answer = [];
        for (let i = 0; i < user_test_answers.chosen_answers.length; i++) {
            if (user_test_answers.chosen_answers[i].question == question.id) {
                answer.push(user_test_answers.chosen_answers[i].answer_body)
            }
        }
        if (answer === []) {
            answer.push('<p style="color: red">Вы не ответили на этот вопрос</p>')
        }
        return answer
    }
    console.log(user_test_answers)
    localStorage.removeItem('testTime')
    return (
        <Fragment>
            {course && test && user_test_answers && user_test_answers != [] &&
            <Container>
                <Container className={'courseInfoContainer'}>
                    <Typography className={'courseInfoTitle'}>{course.title}</Typography>
                    <Typography className={'lessonHeader'}>{test.title}</Typography>
                </Container>
                <Container className={'questionCount'}>
                    Результаты
                </Container>
                <Container className={'testResultsShadowContainer'}>
                    <Container className={'testMark'}>
                        <Container>
                            Итоговый балл:
                        </Container>
                        <Typography className={'testAverage'}>{user_test_answers.test_mark}</Typography>
                    </Container>
                </Container>
                <Container className={'testResultsShadowContainer'}>
                    <Container className={'testMark'}>
                        <Container>
                            Время прохождения теста:
                        </Container>
                        <Typography className={'testAverage'}>{formatSeconds(user_test_answers.test_time)}</Typography>
                    </Container>

                </Container>
                <Container className={'questionCount'}>
                    Вопросы
                </Container>
                {user_test_answers && user_test_answers?.test_questions?.map((quest, index) => (
                    <Container className={'questionShadowContainer'}>
                        <Typography>
                            {renderHTML(quest.question_body)}
                        </Typography>
                        <Dropdown>
                            <MenuItem className={'answersDropDown'}
                            >
                                <Typography className={'correctAnswer'}>Ваш ответ:</Typography>
                                {getUserAnswer(quest).map((q, key) => (
                                    <p style={{marginRight: '15px'}}>
                                        {renderHTML(q)}
                                    </p>
                                ))}
                            </MenuItem>
                            <MenuItem className={'answersDropDown'}
                            >
                                <Typography className={'correctAnswer'}>Правильный ответ:</Typography>
                                {getRightAnswer(quest).map((q, i) => (
                                    <p style={{marginRight: '15px'}}>
                                        {renderHTML(q)}
                                    </p>
                                ))}
                            </MenuItem>
                        </Dropdown>
                    </Container>

                ))}
                <Container className={'testTryAgain'}>
                    <Button
                        className={'buttonGoAhead'}
                        onClick={tryAgain}>
                        Попробовать снова
                    </Button>
                    <Button className={'exitTestButton'}
                            component={Link}
                            to={`/user/profile/${user.id}`}>
                        Выйти
                    </Button>
                </Container>

            </Container>
            }

        </Fragment>

    )
}

TestResults.propTypes = {
    tryTestAgain: PropTypes.func.isRequired
}

export default connect(null, {tryTestAgain})(TestResults);