import { Button, Checkbox, Container, FormControl, FormControlLabel, FormGroup, Typography } from '@material-ui/core';
import SelectInput from '@material-ui/core/Select/SelectInput';
import { Box } from '@material-ui/core';
import React, { useEffect } from 'react';
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getQuestion } from '../../actions/tests';
import { removeHTMLTags } from '../../helpers/editContentHelper';
import { useStyles } from './QuestionList';


export function QuestionBody(){

    const { question_id } = useParams();
    const dispatch = useDispatch();
    const { question, chosen_answers } = useSelector(state => state.tests);
    useEffect(() => {
        dispatch(getQuestion(question_id))
    },[question_id])

    const styles = useStyles();
    const getTestResult = () => {
        
    }

    const onChoiceChange = (e, answer, index) => {
        if(e.target.checked && !chosen_answers[index].some(el => el.id == answer.id)){
            chosen_answers[index].push(answer)
        }
        else if(!e.target.checked && chosen_answers[index].some(el => el.id == answer.id)){
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
                                control={<Checkbox onChange={(e, _) => onChoiceChange(e, answer, question_id)}/>}
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

export default QuestionBody;