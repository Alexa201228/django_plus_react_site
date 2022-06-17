import React, {useEffect, Fragment, useState} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';
import {Link, useNavigate} from "react-router-dom";

import {
    Button,
    Checkbox,
    Container, FormControl,
    FormControlLabel,
    FormGroup,
    Typography
} from '@material-ui/core';

import {getQuestion, testResults, getJustTest} from '../../actions/tests';
import {getRandomQuestion} from '../../helpers/utils';
import {Timer} from "../../helpers/timerComponent";


export function QuestionBody(props) {

    const {test_id, question_id, lesson_slug} = useParams();
    const {user} = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const {question, user_chosen_answers, test, questions_amount, chosen_questions} = useSelector(state => state.tests);
    const {course} = useSelector(state => state.courses);
    const [seconds, setSeconds] = useState(localStorage.getItem('testTime') ? localStorage.getItem('testTime') : 0);
    const [isActive, setIsActive] = useState(true)
    const navigate = useNavigate();
    useEffect(() => {

        dispatch(getQuestion(question_id))
        if (!chosen_questions.some(q => q == question_id)) {
            chosen_questions.push(parseInt(question_id))
        }
    }, [question_id])

    useEffect(() => {
        dispatch(getJustTest(test_id))
    }, [test_id])
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
        window.history.go(1);
    };

    //Получение результатов тестирования
    const getTestResult = () => {
        const test_time = localStorage.getItem('testTime')
        const requestBody = {
            test_id,
            user_chosen_answers,
            test_time
        }
        localStorage.setItem('testTime', 0)
        props.testResults(requestBody);
        navigate(`/test/${test_id}/results/test_results`);
    }

    const getRandomNextQuestion = (allQuestions) => {
        let questionsIds = [];
        for (let i = 0; i < allQuestions?.length; i++) {
            questionsIds.push(allQuestions[i].id)
        }
        let temp = getRandomQuestion(questionsIds, chosen_questions);
        return temp
    }

    const setSelectedAnswers = (ans) => {
        if (user_chosen_answers && question_id in user_chosen_answers && user_chosen_answers[question_id].some(answer => answer == ans)) {
            return true
        }

    }

    //Подсчет правильных ответов.
    // Необходимо для определения типа выбора правильного ответа:
    // Для множественного ответа - генерация чекбоксов,
    // для вопроса с одним ответом - радиобаттоны
    const countAnswersNumber = (cur_question) => {
        return cur_question.answers_to_question?.filter(ans => ans.is_correct === true).length;
    }

    //Управление выбранными ответами при изменении состояния checkbox'ов
    const onChoiceChange = (e) => {
        if (e.target.checked && !user_chosen_answers[question_id].some(el => el === e.target.value)) {
            user_chosen_answers[question_id].push(e.target.value)
        } else if (!e.target.checked && user_chosen_answers[question_id].some(el => el === e.target.value)) {
            user_chosen_answers[question_id] = user_chosen_answers[question_id].filter(ans => ans !== e.target.value);
        }

        if (countAnswersNumber(question) < 2) {
            let checkboxes = document.getElementsByClassName('PrivateSwitchBase-input-19')
            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].value != e.target.value && checkboxes[i].checked) {
                    checkboxes[i].click();
                }
            }
        }
    }

    const getQuestionIndex = () => {
        return chosen_questions.findIndex(q => q == question_id) + 1;
    }

    const getFurtherQuestion = () => {
        let lastPathSlash = window.location.pathname.lastIndexOf('/');
        let newPath = window.location.pathname.substr(0, lastPathSlash) + `/${getRandomNextQuestion(test?.questions_on_test)}`
        return newPath;
    }

    const isLastQuestion = () => {
        return getQuestionIndex() == questions_amount || getQuestionIndex() == test?.questions_on_test.length;
    }

    const answersContainer = (
        <FormGroup>
            {question?.answers_to_question?.map((answer, index) => (
                <FormControlLabel
                    key={`${index}-${answer.id}`}
                    control={
                        <Checkbox
                            key={answer.id}
                            value={answer.id}
                            defaultChecked={setSelectedAnswers(answer.id)}
                            onChange={e => onChoiceChange(e)}/>}
                    label={renderHTML(answer.answer_body)}/>

            ))}
        </FormGroup>
    );

    const finishTest = (
        <Button
            className={'enrollCourseButton'}
            onClick={getTestResult}>
            Завершить тест
        </Button>
    );

    const goAhead = (
        <Button
            className={'buttonGoAhead'}
            component={Link}
            to={`${getFurtherQuestion()}`}>
            Далее
        </Button>
    )


    return (
        <Fragment>
            {question && test && test.questions_on_test ?
                <Fragment>
                    <Container>
                        <Container className={'mainTestContainer'}>
                            <Timer isActive={isActive} seconds={seconds} setSeconds={setSeconds}/>
                        </Container>

                        <Container className={'courseInfoContainer'}>
                            <Typography className={'courseInfoTitle'}>{course.title}</Typography>
                            <Typography className={'lessonHeader'}>{test.title}</Typography>
                        </Container>
                        <Container
                            component={Link}
                            to={`/${course.slug}`}
                            className={'backLinkContainer'}>
                            <Typography className={'backLinkText'}>Назад</Typography>
                        </Container>
                        <Container className={'questionCount'}>
                            Вопрос {getQuestionIndex()}/{questions_amount}
                        </Container>
                        <Container className={'questionShadowContainer'}>
                            <Typography>
                                {renderHTML(question.question_body)}
                            </Typography>
                        </Container>
                        <Container>
                            <FormControl>
                                {answersContainer}
                            </FormControl>
                        </Container>
                        <Container className={'testButtonContainer'}>
                            {isLastQuestion() ? finishTest : goAhead}
                        </Container>
                    </Container>
                </Fragment>
                : null}

        </Fragment>
    )
}


QuestionBody.propTypes = {
    testResults: PropTypes.func.isRequired
}

export default connect(null, {testResults})(QuestionBody);