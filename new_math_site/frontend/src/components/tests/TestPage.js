import React, { useEffect, useState } from 'react';
import { Fragment } from 'react';
import Switch from 'react-bootstrap/esm/Switch';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, useParams, withRouter } from 'react-router';
import { getQuestion, getTest } from '../../actions/tests';
import QuestionBody from './QuestionBody';
import QuestionList from './QuestionList';
import TestResults from './TestResults';
import PrivateRoute
 from '../common/PrivateRoute';
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles((theme) =>({
    testContainer:{
        display: 'flex',
    },
}));

export function TestPage(){
    const { slug, lesson_slug, test_id } = useParams();
    const { test } = useSelector(state => state.tests);
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(getTest(test_id))
    }, [])
    const styles = useStyles();
    return(
        <Fragment>
            {test ?
            <Fragment>
                <Container className={styles.testContainer}>
                <QuestionList questions={test.questions_on_test}/>
                <Switch>
                    <Redirect from={`/${slug}/${lesson_slug}/${test_id}/`} to={`/${slug}/${lesson_slug}/${test_id}/${test.questions_on_test[0].id}`}/>
                    <PrivateRoute exact path='/:slug/:lesson_slug/:test_id/results/test_results' component={TestResults}/>
                    <PrivateRoute key='question' exact path='/:slug/:lesson_slug/:test_id/:question_id' component={QuestionBody}/>
                </Switch>
                </Container>
            </Fragment>
            :null}
        </Fragment>
    )
}

export default withRouter(TestPage);