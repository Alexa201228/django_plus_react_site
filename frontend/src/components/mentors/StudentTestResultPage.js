import {Container, Typography} from "@material-ui/core";
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {getTest, getTestUsers} from "../../actions/tests";


export function StudentTestResultPage(){

    const { test_id } = useParams();
    const { test_users } = useSelector((state) => state.tests);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getTest(test_id))
    }, [test_id])
    useEffect(() => {
        dispatch(getTestUsers(test_id))
    },[test_id])
    console.log(test_users)
    return (

        <>{test_users &&
            <>
                <Container >
                    <Container className={'courseInfoContainer'}>
                        <Typography className={'courseInfoTitle'}>Студенты, принявшие участие в тестировании:</Typography>
                    </Container>
                    <Container >

                        {test_users.map((student, key) => (
                            <Container component={Link} to={`${student.id}`} className={'testStudentResultsShadowContainer'}>
                                <Container
                                    key={key}>
                                    {student.first_name} {student.last_name} {student.patronymic}
                                </Container>
                                <Container>
                                    Номер зачетной книжки: {student.student_book_number.student_book_number}
                                </Container>
                            </Container>

                    ))}
                    </Container>

                </Container>
            </>
        }
        </>
    )
}

export default StudentTestResultPage;