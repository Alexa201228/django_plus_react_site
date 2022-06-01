import React from 'react';
import {Link} from 'react-router-dom';

import {Container, Typography} from '@material-ui/core';
import './../../styles/profileStyles.css'


export function CourseLessonsList({lessons, course}, props) {

    return (
        <>
            <Container className={'mainLessonsContainer'}>
                <Typography className={'lessonParagraph'}>Уроки</Typography>
                <Typography className={'lessonHelpTextParagraph'}> Для перехода к уроку, нажмите на него</Typography>
                <Container className={'studentCoursesContainer'}>
                    {lessons.map((lesson, index) => (
                        <Container className={'lessonContainer'}
                                   button
                                   component={Link}
                                   to={`/${course.slug}/${lesson.lesson_slug}`}
                                   key={index}>
                            <Typography>
                                {lesson.lesson_name}
                            </Typography>
                        </Container>
                    ))}
                </Container>
                <Typography className={'lessonParagraph'}>Доступные тесты</Typography>
                <Typography className={'lessonHelpTextParagraph'}> Для перехода к тесту, нажмите на него</Typography>
                <Container className={'studentCoursesContainer'}>
                    {course.course_test?.[0] ?
                        <Container className={'lessonContainer'}
                                   button
                                   component={Link}
                                   to={`/test/${course.slug}/${course.course_test[0].id}/questions/${course.course_test[0].questions_on_test[0].id}`}>
                            <Typography>
                                {course.course_test[0].title}
                            </Typography>
                        </Container> : null}

                    {lessons && lessons.map((lesson, index) => (
                        lesson.module_test[0] &&
                        <Container className={'lessonContainer'}
                                   button
                                   component={Link}
                                   to={`/test/${course.slug}/${lesson.module_test[0].id}/${lesson.lesson_slug}/questions/${lesson.module_test[0].questions_on_test[0].id}`}
                                   key={index}>
                            <Typography>
                                {lesson.module_test[0]?.title}
                            </Typography>
                        </Container>
                    ))}
                </Container>
            </Container>
        </>
    )
}

export default CourseLessonsList;