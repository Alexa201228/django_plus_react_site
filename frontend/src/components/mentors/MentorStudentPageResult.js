import {Button, Container, Typography} from "@material-ui/core";
import {Link, Outlet, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {getAllStudentGroups} from "../../actions/auth";
import {getJustTest} from "../../actions/tests";


export function MentorStudentPageResult() {

    const {groups} = useSelector(state => state.auth);
    const {course} = useSelector(state => state.courses)
    const {test_id} = useParams()
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllStudentGroups())
        dispatch(getJustTest(test_id))
    }, [test_id])

    const getDistinctYears = () => {
        let startYears = []
        for (let i = 0; i < groups.length; i++) {
            startYears.push(groups[i].start_year)
        }
        return [...new Set(startYears)];
    }

    return (
        <>
            {groups &&
            <>
                <Container>
                    <Container className={'courseInfoContainer'}>
                        <Typography className={'courseInfoTitle'}>Выберите год обучения:</Typography>
                        <Button component={Link}
                                to={`/tests/${test_id}/edit`}
                                className={'yearButton'}>Изменить тест</Button>
                    </Container>
                    <Container
                        component={Link}
                        to={`/lessons-list/${course.slug}`}
                        className={'backLinkContainer'}>
                        <Typography className={'backLinkText'}>Назад</Typography>
                    </Container>
                    <Container>
                        {getDistinctYears().map((year, index) => (
                            <Button
                                className={'yearButton'}
                                key={index}
                                component={Link}
                                to={`${year}`}>{year}</Button>
                        ))}
                    </Container>

                </Container>
                <Outlet/>
            </>}

        </>
    )
}

export default MentorStudentPageResult;