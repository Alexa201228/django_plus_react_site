import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useParams} from 'react-router';

import {Container, Typography} from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

import { getTest } from '../../actions/tests';


const useStyles = makeStyles((theme) =>({
    testContainer:{
        display: 'flex',
    },
}));

export function TestPage(){
    const { lesson_slug, test_id } = useParams();
    const { test } = useSelector(state => state.tests);
    const {course, lesson} = useSelector(state => state.courses);
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(getTest(test_id))
    }, [test_id])
    const styles = useStyles();
    console.log(lesson)
    console.log(course)
    return(
        <Fragment>
            {!!test && !!course ?
            <Fragment>
                <Container style={{'marginTop': '12em'}}>
                    <Typography>
                        Тест к {lesson_slug ? "уроку" : "курсу"} "{lesson ? `${lesson.lesson_name}` : `${course.title}`}".
                        Данный тест содержит {test.questions_on_test.length} вопроса(ов) для проверки знаний.
                    </Typography>
                </Container>
            </Fragment>
            :null}
        </Fragment>
    )
}

export default TestPage;