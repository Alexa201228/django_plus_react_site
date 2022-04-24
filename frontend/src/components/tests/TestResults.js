import { useParams } from 'react-router';
import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { Box, Container, Typography, Button } from '@material-ui/core';

import { tryTestAgain } from '../../actions/tests';
import { useStyles } from './../../App';
import renderHTML from "react-render-html";


export function TestResults(props){
    const { correct_answers, result, test} = useSelector(state => state.tests)
    const { slug, lesson_slug, test_id } = useParams();

    const tryAgain = () =>{
        props.tryTestAgain(test_id)
        window.history.push(`/${slug}/${lesson_slug}/${test_id}/${test.questions_on_test[0].id}`)
    }

    console.log(correct_answers)
    const styles = useStyles();
    return(
        <Fragment>
            <Container className={styles.contentContainer}>
                <h3>Результаты теста</h3>
                <Box>
                    <Typography>
                        Вы прошли тест на {result}%!
                    </Typography>
                </Box>
                <Typography
                paragraph={true}
                my={4}>
                    Ответы
                </Typography>
                {Object.keys(correct_answers).map((question, index) => (
                    correct_answers[question].map((q, k)=>(
                        <Typography
                        key={k}>
                           Вопрос { index + 1 }: {renderHTML(q.answer_body)}
                    </Typography>
                    )) 
                ))}
                <Button
                    onClick={tryAgain}>
                        Попробовать снова
                </Button>
            </Container>
        </Fragment>

    )
}

TestResults.propTypes = {
    tryTestAgain: PropTypes.func.isRequired
}

export default connect(null, { tryTestAgain })(TestResults);