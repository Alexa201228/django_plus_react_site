import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Outlet, useParams} from 'react-router';
import {Routes, Route} from "react-router-dom"

import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

import { getTest } from '../../actions/tests';
import QuestionBody from './QuestionBody';
import QuestionList from './QuestionList';
import TestResults from './TestResults';
import PrivateRoute from '../common/PrivateRoute';


const useStyles = makeStyles((theme) =>({
    testContainer:{
        display: 'flex',
    },
}));

export function TestPage(){
    const { test_id } = useParams();
    const params = useParams();
    const { test } = useSelector(state => state.tests);
    const dispatch = useDispatch();
    console.log(params)
    useEffect(()=>{
        dispatch(getTest(test_id))
    }, [test_id])
    const styles = useStyles();
    return(
        <Fragment>
            {test ?
            <Fragment>
                <Container className={styles.testContainer}>
                <QuestionList questions={test.questions_on_test}/>
                    <Outlet/>
                </Container>
            </Fragment>
            :null}
        </Fragment>
    )
}

export default TestPage;