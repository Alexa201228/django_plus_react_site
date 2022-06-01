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
import {Link, Outlet, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {getTest, getTestUsers} from "../../actions/tests";
import axios from "axios";
import {API_PATH} from "../../helpers/requiredConst";


export function StudentTestResultPage() {

    const {test_id, group, year} = useParams();
    const {test_users, test} = useSelector((state) => state.tests);
    const userState = useSelector(state => state.auth);
    const [usersResults, setUsersResults] = useState(undefined);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getTestUsers(test_id, group));
        setUsersResults({})
        async function getAllUsersResults() {
            let usersResults = {};
            const token = userState.access_token;
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            for (let i = 0; i < test_users.length; i++) {
                const resp = await axios.get(
                    `${API_PATH}/api/tests/${test_id}/students/student-result?user-id=${test_users[i].id}`,
                    config
                )
                usersResults[test_users[i].id] = resp.data.test_results.test_mark;
            }
            setUsersResults(usersResults)
        }

        getAllUsersResults()
    }, [group, year])

    console.log(`${group}, ${year}`)
    return (

        <>{test_users && usersResults &&
        <>
            <Container>
                <Container className={'courseInfoContainer'}>
                    <Typography className={'courseInfoTitle'}>{test.title}</Typography>
                </Container>
                <TableContainer className={'testResultTableContainer'}>
                    <Table className={'testResultTable'}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">ФИО</TableCell>
                                <TableCell align="center">Результат</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {test_users.map((student, key) => (
                                <TableRow key={key}>
                                    <TableCell
                                        key={`${key + 10}`}
                                        align="right">
                                        {student.first_name} {student.last_name} {student.patronymic}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Container className={'testUsersResult'}>
                                            <Typography
                                                className={'testUserLabel'}>{usersResults[student.id]}</Typography>
                                            <Link to={`/tests/${test_id}/students/results/${student.id}`}>
                                                <Typography className={'testUserLinkTypography'}>
                                                    Смотреть результат
                                                </Typography>
                                            </Link>
                                        </Container>
                                    </TableCell>
                                </TableRow>

                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Container>


                </Container>
                <Outlet/>
            </Container>
        </>
        }
        </>
    )
}

export default StudentTestResultPage;