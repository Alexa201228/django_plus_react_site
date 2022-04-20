import React, { useEffect, Fragment } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';

import {
    Button,
    Checkbox,
    Container, FormControl,
    FormControlLabel,
    FormGroup,
    Radio,
    RadioGroup,
    Typography
} from '@material-ui/core';
import { Box } from '@material-ui/core';

import { getQuestion, testResults } from '../../actions/tests';
import { useStyles } from '../App';

export function QuestionBody(props){

    const { slug, lesson_slug, test_id, question_id } = useParams();
    const dispatch = useDispatch();
    const { question, chosen_answers, finished } = useSelector(state => state.tests);
    const styles = useStyles();
    useEffect(() => {
        dispatch(getQuestion(question_id))
    },[question_id])

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
    const onChoiceChange = (e) => {
        console.log('choice changed')

        if(e.target.checked && !chosen_answers[question_id].some(el => el === e.target.value)){
            chosen_answers[question_id].push(e.target.value)
        }
        else if(!e.target.checked && chosen_answers[question_id].some(el => el === e.target.value)){
            chosen_answers[question_id] = chosen_answers[question_id].filter(ans => ans !== e.target.value);
        }
    }
    const handleRadioButtonChange = (e) => {
        console.log(e.target.value)
        e.target.checked = true;
        chosen_answers[question_id] = [e.target.value];
        console.log(chosen_answers[question_id])
    }

    const checkedAnswer = (e) => {
        console.log(e.target)
        console.log(chosen_answers[question_id][0] === e.target.value)
        console.log(e.target.checked)
        return chosen_answers[question_id][0] === e.target.value;

    }


    const oneAnswerContainer = (
        <RadioGroup>
                {question.answer_to_question.map((answer, index) => (
                <FormControlLabel
                    control={
                        <Radio
                            key={`${index}-${answer.id}`}
                            value={answer.id}
                        onChange={handleRadioButtonChange}/>
                    }
                    label={renderHTML(answer.answer_body)}/>
                ))}
        </RadioGroup>
    );

    const manyAnswersContainer = (
        <FormGroup>
            {question.answer_to_question.map((answer, index) => (
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
                    <FormControl>
                        {manyAnswersContainer}
                    </FormControl>
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