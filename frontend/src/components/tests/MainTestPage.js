import React, {useEffect, Fragment, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Outlet, useParams} from 'react-router';

import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

import { getTest } from '../../actions/tests';
import {Timer} from "../../helpers/timerComponent";


const useStyles = makeStyles((theme) =>({
    testContainer:{
        display: 'flex',
    },
}));

export function TestPage(){
    const { test_id } = useParams();
    const { test } = useSelector(state => state.tests);
    const { user } = useSelector(state => state.auth);
    const { course } = useSelector(state => state.courses);
    const [seconds, setSeconds] = useState(localStorage.getItem('testTime'));
    const [isActive, setIsActive] = useState(true)
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(getTest(test_id, user.id, course.slug))
    }, [test_id, user.id])
    return(
        <Fragment>
            {test ?
            <Fragment>
                <Container>
                    <Container className={'mainTestContainer'}>
                        <Timer isActive={isActive} seconds={seconds} setSeconds={setSeconds}/>
                    </Container>
                    <Outlet/>
                </Container>
            </Fragment>
            :null}
        </Fragment>
    )
}

export default TestPage;