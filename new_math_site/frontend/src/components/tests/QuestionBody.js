import React, { useEffect, Fragment } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';

import {Button, Checkbox, Container, FormControlLabel, FormGroup, Radio, Typography} from '@material-ui/core';
import { Box } from '@material-ui/core';

import { getQuestion, testResults } from '../../actions/tests';
import { useStyles } from '../App';
import {RadioButtonCheckedRounded} from "@material-ui/icons";

export function QuestionBody(props){

    const { slug, lesson_slug, test_id, question_id } = useParams();
    const dispatch = useDispatch();
    const { question, chosen_answers, finished } = useSelector(state => state.tests);
    const styles = useStyles();
    useEffect(() => {
        dispatch(getQuestion(question_id))
    },[question_id])

    const history = useHistory();

    //Получение результатов тестирования
    const getTestResult = () => {
        const requestBody = {
            test_id,
            chosen_answers
        }
        props.testResults(requestBody);
        history.push(`/${slug}/${lesson_slug}/${test_id}/results/test_results`)
    }

    const setSelectedAnswers = (ans) => {
        if(question_id in chosen_answers && chosen_answers[question_id].some(answer => answer == ans))
        {
            console.log(ans)
            return true
        }

    }

    //Подсчет правильных ответов.
    // Необходимо для определения типа выбора правильного ответа:
    // Для множественного ответа - генерация чекбоксов,
    // для вопроса с одним ответом - радиобаттоны
    const countAnswersNumber = (cur_question) => {
        return cur_question.answer_to_question.filter(ans => ans.is_correct === true).length;
    }

    //Управление выбранными ответами при изменении состояния checkbox'ов
    const onChoiceChange = (e, answer) => {
        if(e.target.checked && !chosen_answers[question_id].some(el => el == answer)){
            chosen_answers[question_id].push(answer)
        }
        else if(!e.target.checked && chosen_answers[question_id].some(el => el == answer)){
            const newAnswerArray = chosen_answers[question_id].filter(ans => ans != answer)
            chosen_answers[question_id] = newAnswerArray;
        }
    }

    const testNotFinished = (
        <Box>
            <Button
                onClick={getTestResult}>
                Завершить тест
            </Button>
        </Box>
    )
    return(
        <Fragment>
            {question ?
            <Fragment>
                <Container className={styles.contentContainer}>
                    <Typography>
                        {renderHTML(question.question_body)}
                    </Typography>
                    <FormGroup>
                        {question.answer_to_question.map((answer, index) => (

                                <FormControlLabel
                                    key={`${index}-${answer.id}`}
                                    control={
                                    <Checkbox
                                        key={answer.id}
                                        value={false}
                                        defaultChecked={setSelectedAnswers(answer.id)}
                                        onChange={e => onChoiceChange(e, answer.id)}/>}
                                        label={renderHTML(answer.answer_body)}/>

                        ))}
                    </FormGroup>
                </Container>
                    <Container>
                        {!finished && testNotFinished }
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