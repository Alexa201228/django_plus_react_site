import { Container, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import { Fragment } from 'react';
import { Link, useParams, withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';


export const useStyles = makeStyles((theme) => ({
	questionContainer: {
        marginTop: theme.spacing(3),
	},
 }));

export function QuestionList({questions}){

    const  {slug, lesson_slug, test_id } = useParams();
    const {finished} = useSelector(state => state.tests)
    const styles = useStyles();

    return (
        <Fragment>
            <Container className={styles.questionContainer}>
            {questions.map((question, index) => (
                    <Typography
                    key={index}>
                        <Link
                        to={`/${slug}/${lesson_slug}/${test_id}/${question.id}`}
                        key={`${question.id}+${test_id}`}>
                            Вопрос {index + 1}
                        </Link>
                    </Typography>
                ))}
                {finished &&
                <Typography>
                    <Link
                        to={`/${slug}/${lesson_slug}/${test_id}/results/test_results`}>
                            Результаты теста
                    </Link>
                </Typography>}
            </Container>            
        </Fragment>
    )
}

export default withRouter(QuestionList);