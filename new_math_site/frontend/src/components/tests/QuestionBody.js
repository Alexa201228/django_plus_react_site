import { Button, Checkbox, Container, FormControl, FormControlLabel, FormGroup, Typography } from '@material-ui/core';
import { Box } from '@material-ui/core';
import React, { useEffect } from 'react';
import { Fragment } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getQuestion, testResults } from '../../actions/tests';
import { removeHTMLTags } from '../../helpers/editContentHelper';
import { useStyles } from './QuestionList';
import PropTypes from 'prop-types';


export function QuestionBody(props){

    const { test_id, question_id } = useParams();
    const dispatch = useDispatch();
    const { question, chosen_answers } = useSelector(state => state.tests);
    useEffect(() => {
        dispatch(getQuestion(question_id))
    },[question_id])

    const styles = useStyles();
    //Получение результатов тестирования
    const getTestResult = () => {
        const requestBody = {
            test_id,
            chosen_answers
        }
        console.log(requestBody)
        props.testResults(requestBody)
    }

    const setSelectedAnswers = (ans) => {
        return chosen_answers[question_id].some(a => a == ans)
    }

    //Управление выбранными ответами при изменении состояния checkbox'ов
    const onChoiceChange = (e, answer, index) => {

        if(e.target.checked && !chosen_answers[index].some(el => el == answer)){
            chosen_answers[index].push(answer)
        }
        else if(!e.target.checked && chosen_answers[index].some(el => el == answer)){
            const newAnswerArray = chosen_answers[index].filter(ans => ans != answer)
            chosen_answers[index] = newAnswerArray;
        }
    }

    return(
        <Fragment>
            {question ?
            <Fragment>
                <Container className={styles.questionContainer}>
                    <Typography>
                        {removeHTMLTags(question.question_body)}
                    </Typography>
                    <FormGroup>
                        {question.answer_to_question.map((answer, index) => (
                            <FormControlLabel
                            key={index}
                                control={
                                <Checkbox
                                key={answer.id}
                                value={false}
                                defaultChecked={setSelectedAnswers(answer.id)}
                                onChange={e => onChoiceChange(e, answer.id, question_id)}/>}
                                label={removeHTMLTags(answer.answer_body)}/>
                        ))}
                    </FormGroup>
                </Container>
                <Container>
                    <Button
                    onClick={getTestResult}>
                        Завершить тест
                    </Button>
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