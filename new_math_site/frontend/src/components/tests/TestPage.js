import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getTest } from '../../actions/tests';


export function TestPage(){
    const { test_id } = useParams();
    const { test } = useSelector(state => state.tests);
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(getTest(test_id))
    }, [])
    console.log(test)
    return(
        <h3></h3>
    )
}

export default TestPage;