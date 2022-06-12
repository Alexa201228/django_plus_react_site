import {
    Button,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import {useEffect} from "react";
import {deleteDownloadedReport, getGroupStudents} from "../../actions/auth";
import axios from "axios";
import {API_PATH} from "../../helpers/requiredConst";

export function MentorReportTestsPage() {

    const {course} = useSelector(state => state.courses);
    const {student_group, access_token, students_marks} = useSelector(state => state.auth);
    const {group, year} = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getGroupStudents(group, course.slug))
    }, [group, course])

    const handleDownloadReportButtonClick = () => {
        let filepath = '/reports/';
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        if (access_token) {
            config.headers['Authorization'] = `Bearer ${access_token}`;
        }

        axios.get(`${API_PATH}/api/student_groups/group/students/report?group-name=${group}&course=${course.slug}`, config)
            .then(res => {
                filepath += res.data.filename;
                localStorage.setItem('reportFilepath', filepath)
                const link = document.createElement('a');
                link.download = res.data.filename;
                link.href = filepath;
                link.target = '_blank';
                link.click();
                document.removeChild(link)

            })
            .then(setTimeout(() => {
                dispatch(deleteDownloadedReport(localStorage.getItem('reportFilepath')))
            }, 10000))
            .catch(err => {
                console.log(err)
            })

    }

    const getStudentsTests = (student) => {
        let studentTests = []
        for (const mark in students_marks[student.id]) {
            let res = {}
            if (students_marks[student.id][mark] > 0) {
                res[mark] = `${students_marks[student.id][mark]}`
                studentTests.push(res)
            } else {
                res[mark] = '-'
                studentTests.push(res)
            }
        }

        return studentTests;
    }
    return (
        <>
            {course && student_group &&
            <>
                <Container>
                    <Typography className={'tableTitle'}>{course.title}</Typography>
                    <Container className={'testHeaderContainer'}>
                        <Typography style={{width: '300px'}}
                                    className={'tableTitleWithGroup'}>Группа {group}</Typography>
                        <Typography className={'tableTitleWithTest'}>Тесты</Typography>
                    </Container>
                    <TableContainer>
                        <Table className={'testInfoTable'}>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{width: '300px'}} className={'tableCell'}>Фамилия И.О.
                                        студента</TableCell>
                                    {course?.course_test?.[0] &&
                                    <TableCell className={'tableCell'}>
                                        {course.course_test?.[0].title}
                                    </TableCell>}
                                    {course.course_lessons.map((lesson, key) => (
                                        lesson.module_test.map((test, index) => (
                                            <TableCell className={'tableCell'}>
                                                {test.title}
                                            </TableCell>
                                        ))
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {student_group.map((student, key) => (
                                    <TableRow>
                                        <TableCell
                                            className={'tableCell'}>{student.last_name} {student.first_name?.[0]} {student.patronymic?.[0]}</TableCell>
                                        {getStudentsTests(student).map((res, key) => (
                                            res[Object.keys(res)[0]] !== '-' ?
                                                <TableCell component={Link}
                                                           to={`/tests/${Object.keys(res)[0]}/students/${student.id}/attempts`}
                                                           className={'tableCell'}>{res[Object.keys(res)[0]]}</TableCell>
                                                : <TableCell
                                                    className={'tableCell'}>{res[Object.keys(res)[0]]}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}


                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button className={'yearButton'} onClick={handleDownloadReportButtonClick}>Выгрузить отчет в
                        PDF</Button>

                </Container>
            </>}

        </>
    )
}

export default MentorReportTestsPage;