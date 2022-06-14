import {Button, Container, Typography} from "@material-ui/core";
import {Link, Outlet, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {getAllStudentGroups} from "../../actions/auth";


export function MentorStudentPageResult() {

    const {groups} = useSelector(state => state.auth);
    const {test_id} = useParams()
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllStudentGroups())
    }, [])

    const getDistinctYears = () => {
        let startYears = []
        for (let i = 0; i < groups.length; i++) {
            startYears.push(groups[i].start_year)
        }
        return [...new Set(startYears)];
    }

    console.log(groups)
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