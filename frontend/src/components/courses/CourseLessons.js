import React, {useEffect, Fragment} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router';
import {Link, NavLink} from 'react-router-dom';

import {Button, Container, Typography} from '@material-ui/core';
import renderHTML from 'react-render-html';
import {getLesson} from '../../actions/courses';
import {useStyles} from './../../App';


export function CourseLesson() {
    const {slug, lesson_slug} = useParams();
    const dispatch = useDispatch();
    const {course, lesson} = useSelector(state => state.courses)
    const {user, isAuthenticated, isMentor} = useSelector(state => state.auth)
    //перезапускаем useEffect только если поменялся lesson_slug
    useEffect(() => {
        dispatch(getLesson({slug, lesson_slug}))
    }, [lesson_slug])

    const styles = useStyles();
    return (
        <Fragment>
            {lesson ?
                <Fragment>
                    <Container className={'mainLessonContentContainer'}>
                        <Container className={'courseInfoContainer'}>
                            <Typography className={'courseInfoTitle'}>{course.title}</Typography>
                            <Typography className={'lessonHeader'}>{lesson.lesson_name}</Typography>
                        </Container>
                        <Container
                            component={Link}
                            to={-1}
                            className={'backLinkContainer'}>
                            <Typography className={'backLinkText'}>Назад</Typography>
                        </Container>
                        <Container className={'lessonContentContainer'}>
                            {renderHTML(lesson.body)}
                        </Container>
                        {lesson.module_test && isAuthenticated && !isMentor
                        && user.student_courses.some(c => course.id === c.id) ?
                            <Container className={'goToTest'}>
                                <Button
                                    className={'enrollCourseButton'}
                                    component={NavLink}
                                    to={`/test/${course.slug}/${lesson.module_test[0].id}/${lesson.lesson_slug}/questions/${lesson.module_test[0].questions_on_test[0].id}`}>
                                    Перейти к тесту
                                </Button>
                            </Container>
                            : null}
                    </Container>
                </Fragment>
                : null}
        </Fragment>
    )
}


export default CourseLesson;