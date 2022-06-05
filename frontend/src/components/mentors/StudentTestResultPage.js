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
import {getJustTest, getTest, getTestUsers} from "../../actions/tests";
import axios from "axios";
import {API_PATH} from "../../helpers/requiredConst";


export function StudentTestResultPage() {

    const {test_id, group, year} = useParams();
    const {test_users, test} = useSelector((state) => state.tests);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getJustTest(test_id));
        dispatch(getTestUsers(test_id, group));


    }, [test_id, group, year])

    return (

        <>{test && test_users &&
        <>
            <Container>
                <Container className={'courseInfoContainer'}>
                    <Typography className={'courseInfoTitle'}>{test.title}</Typography>
                </Container>
                <TableContainer className={'testResultTableContainer'}>
                    <Table className={'testResultTable'}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">ФИО</TableCell>
                                <TableCell align="center">Результат</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {test_users.map((student, key) => (
                                <TableRow key={key}>
                                    <TableCell
                                        key={`${key + 10}`}
                                        align="center">
                                        {student.first_name} {student.last_name} {student.patronymic}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Container className={'testUsersResult'}>
                                            <Link to={`/tests/${test_id}/students/${student.id}/attempts`}>
                                                <Typography className={'testUserLinkTypography'}>
                                                    Подробнее
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