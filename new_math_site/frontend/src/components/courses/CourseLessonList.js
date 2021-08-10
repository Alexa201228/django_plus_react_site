import React, { Fragment } from 'react';
import { Container, Typography } from '@material-ui/core';
import { Link, NavLink, useParams } from 'react-router-dom';
import { Button } from '@material-ui/core';


export function CourseLessonsList({lessons, course}){
    const { slug } = useParams();

    return(
        <Fragment>
            <Container>
                <Button
                    href=''
                    component={NavLink}
                    to={`/${course.slug}`}
                >
                    {course.title}
                </Button>
                {lessons.map((lesson, index) => (
                    <Typography
                        key={`${lesson.lesson_name}+${index}`}>
                            <Link 
                                to={`/${slug}/${lesson.lesson_slug}`}
                                key={index}>
                                {lesson.lesson_name}
                            </Link>
                    </Typography> 
                ))}
                
            </Container>
        </Fragment>
    )
}

export default CourseLessonsList;