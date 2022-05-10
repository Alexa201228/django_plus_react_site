import {useSelector} from "react-redux";
import Container from "@material-ui/core/Container";
import {Typography} from "@material-ui/core";
import {Link} from "react-router-dom";


export function MentorMainPage() {
    const {user} = useSelector((state) => state.auth);
    return (
        <>
            {user &&
                <>
                    <Container>
                        {user.first_name} {user.last_name} {user.patronymic}
                    </Container>
                    <Container>
                        <Typography>
                            Преподаваемые дисциплины
                        </Typography>
                        <Container>
                            {user.mentor_courses &&
                            user.mentor_courses.map((course, key) => (
                                    <Container style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <Link
                                        key={`${key}-link`}
                                        to={`/lessons-list/${course.slug}`}
                                        state={{curr_course: course.slug }}
                                        >
                                        <Typography
                                        key={key}>
                                        {course.title}
                                        </Typography>
                                    </Link>
                                        <Link
                                        key={`${key}-test-link`}
                                        to={`/course-tests/${course.slug}`}
                                        state={{curr_course: course.slug }}
                                        >
                                        <Typography
                                        key={`${key}-test-text`}>
                                        Тесты дисциплины
                                        </Typography>
                                    </Link>
                                    </Container>
                                ))
                            }
                        </Container>
                    </Container>
                </>
            }
        </>
    )
}

export default MentorMainPage;