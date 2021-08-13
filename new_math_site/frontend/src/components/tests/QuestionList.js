import { Container, Typography } from '@material-ui/core';
import React from 'react';
import { Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';


export const useStyles = makeStyles((theme) => ({
	questionContainer: {
        marginTop: theme.spacing(3),
	},
 }));

export function QuestionList({questions}){
    const { test_id, lesson_slug, slug } = useParams();


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
                
            </Container>            
        </Fragment>
    )
}

export default QuestionList;