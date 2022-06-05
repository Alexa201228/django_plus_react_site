import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core";
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAllStudentTestAttempts} from "../../actions/tests";


export function StudentsTestAttempts() {

    const {test_id, user_id} = useParams();
    const {student_test_attempts, test_users} = useSelector(state => state.tests);
    const [currentStudent, setCurrentStudent] = useState({});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllStudentTestAttempts(test_id, user_id));
        getCurrentStudent();
    }, [user_id])

    const equalsIgnoreOrder = (a, b) => {
        if (a?.length !== b?.length) return false;
        const uniqueValues = new Set([...a, ...b]);
        for (const v of uniqueValues) {
            const aCount = a.filter(e => e === v).length;
            const bCount = b.filter(e => e === v).length;
            if (aCount !== bCount) return false;
        }
        return true;
    }

    const getCountOfRightAnswers = (result_id) => {

        let studentResult = student_test_attempts[result_id];
        let studentChoices = {};
        for (let i = 0; i < studentResult?.chosen_answers.length; i++) {
            if (!studentChoices[studentResult.chosen_answers[i].question]) {
                studentChoices[studentResult.chosen_answers[i].question] = []
            }
            studentChoices[studentResult.chosen_answers[i].question].push(studentResult.chosen_answers[i].id)
        }

        let questionCorrectAnswers = {};
        let answersCount = 0;

        for (let i = 0; i < studentResult?.test_questions.length; i++) {
            questionCorrectAnswers[studentResult.test_questions[i].id] = [];
            for (let j = 0; j < studentResult.test_questions[i].answers_to_question.length; j++) {
                if (studentResult.test_questions[i].answers_to_question[j].is_correct === true) {
                    questionCorrectAnswers[studentResult.test_questions[i].id].push(studentResult.test_questions[i].answers_to_question[j].id)
                }
            }
        }
        for (const [key, arr] of Object.entries(questionCorrectAnswers)) {
            if (equalsIgnoreOrder(questionCorrectAnswers[key], studentChoices[key])) {
                answersCount++;
            }
        }
        return answersCount;
    }

    const getCurrentStudent = () => {
        let student = test_users.find(student => student.id == user_id);
        setCurrentStudent(student);
    }

    return (
        <>
            {student_test_attempts &&
            <>
                <Container>
                    <Container>
                        <Typography>Результаты студента {currentStudent.first_name} {currentStudent.last_name}</Typography>
                    </Container>
                    <TableContainer className={'testResultTableContainer'}>
                        <Table className={'testResultTable'}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>Номер попытки</TableCell>
                                    <TableCell align="center">Количество правильных ответов</TableCell>
                                    <TableCell align="center">Оценка</TableCell>
                                    <TableCell align="center">Результат</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {student_test_attempts.map((attempt, key) => (
                                    <TableRow key={key}>
                                        <TableCell key={`${key + 3}`}
                                        align={'center'}>
                                            <Typography className='testUserDetailLabel'>
                                              {key + 1}
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            key={`${key + 10}`}
                                            align="center">
                                            <Typography className='testUserDetailLabel'>
                                              {getCountOfRightAnswers(key)}/{attempt.test_questions.length}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                className={'testUserDetailLabel'}>{attempt.test_mark}</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Link to={`/tests/${test_id}/students/${attempt.user_id}/attempts/${attempt.id}`}>
                                                <Typography className={'testUserLinkTypography'}>
                                                    Смотреть результат
                                                </Typography>
                                            </Link>
                                    </TableCell>
                                    </TableRow>

                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </>}

        </>
    )
}

export default StudentsTestAttempts;