import { Box, Container, Typography, Button } from '@material-ui/core';
import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { removeHTMLTags } from '../../helpers/editContentHelper';
import { tryTestAgain } from '../../actions/tests';
import { useHistory, useParams } from 'react-router';


export function TestResults(props){
    const { correct_answers, result, test} = useSelector(state => state.tests)
    const { slug, lesson_slug, test_id } = useParams();
    const history = useHistory()

    const tryAgain = () =>{
        props.tryTestAgain(test_id)
        history.push(`/${slug}/${lesson_slug}/${test_id}/${test.questions_on_test[0].id}`)
    }
    return(
        <Fragment>
            <Container>
                <h3>Результаты теста</h3>
                <Box>
                    <Typography>
                        Вы прошли тест на {result}%!
                    </Typography>
                </Box>
                <Typography
                paragraph={true}>
                    Ответы
                </Typography>
                {Object.keys(correct_answers).map((question, index) => (
                    correct_answers[question].map((q, k)=>(
                        <Typography
                        key={k}>
                           Вопрос { index + 1 }: {removeHTMLTags(q.answer_body)}
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