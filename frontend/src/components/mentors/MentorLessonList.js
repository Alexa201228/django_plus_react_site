import {Button, Container, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import React from "react";


export function MentorLessonList({lessons, course}) {

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
                    <Container className={'lessonContainer'}
                               button
                               component={Link}
                               to={`lessons/add`}>
                        <Typography>
                            +
                        </Typography>
                    </Container>
                </Container>
                <Container className={'mentorTestsButtonLabelContainer'}>
                    <Container style={{padding: 0}}>
                        <Typography className={'lessonParagraph'}>Доступные тесты</Typography>
                        <Typography className={'lessonHelpTextParagraph'}> Для перехода к тесту, нажмите на
                            него</Typography>
                    </Container>
                    <Container className={'reportButtonContainer'}>
                        <Container className={'lessonContainer'}
                                   button
                                   component={Link}
                                   to={`/tests/${course.slug}/report`}>
                            <Typography>
                                Отчет выполнения тестов
                            </Typography>
                        </Container>
                    </Container>
                </Container>
                <Container className={'studentCoursesContainer'}>
                    {course?.course_test?.[0] ?
                        <Container className={'lessonContainer'}
                                   button
                                   component={Link}
                                   to={`/tests/${course?.course_test[0].id}/students`}>
                            <Typography>
                                {course.course_test[0].title}
                            </Typography>
                        </Container> : null}

                    {lessons && lessons.map((lesson, index) => (
                        lesson.module_test[0] &&
                        <Container className={'lessonContainer'}
                                   button
                                   component={Link}
                                   to={`/tests/${lesson.module_test[0]?.id}`}
                                   key={index}>
                            <Typography>
                                {lesson.module_test[0]?.title}
                            </Typography>
                        </Container>
                    ))}
                    <Container className={'lessonContainer'}
                               button
                               component={Link}
                               to={`tests/new`}>
                        <Typography>
                            +
                        </Typography>
                    </Container>
                </Container>
            </Container>
        </>
    )
}

export default MentorLessonList;