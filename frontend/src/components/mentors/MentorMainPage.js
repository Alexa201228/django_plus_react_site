import {useSelector} from "react-redux";
import Container from "@material-ui/core/Container";
import {Box, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import React, {Fragment} from "react";


export function MentorMainPage() {
    const {user} = useSelector((state) => state.auth);
    console.log(user)
    return (
        <>
            {user &&
            <Fragment>
                <Container>
                    <Container className={'latestNewsContainer'}>
                        <Container>
                            <Container className={'studentsMeetingContainer'}/>
                        </Container>
                        <Container>
                            <Container className={'studentsOpportunities'}/>
                        </Container>
                    </Container>
                    <Container>
                        <Typography className={'startedCourses'}>
                            Преподаваемые дисциплины:
                        </Typography>
                        <Typography className={'startedCoursesHelpText'}>
                            Для перехода к дисциплине, нажмите на нее
                        </Typography>
                        <Container className={'studentCoursesContainer'}>
                            {user.mentor_courses && user.mentor_courses.map((course, index) => (
                                <Container
                                    component={Link}
                                    to={`/lessons-list/${course.slug}`}
                                    className='courseContainer'
                                    key={index}>
                                    <Box my={3}
                                    >
                                        <Typography className={'courseTitle'}>
                                            {course.title}
                                        </Typography>
                                    </Box>
                                </Container>
                            ))}
                        </Container>
                    </Container>
                </Container>
            </Fragment>
            }
        </>
    )
}

export default MentorMainPage;