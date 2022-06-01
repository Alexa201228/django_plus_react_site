import {Button, Container, Typography} from "@material-ui/core";
import {Link, Outlet} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {getAllStudentGroups} from "../../actions/auth";


export function MentorStudentPageResult() {

    const {groups} = useSelector(state => state.auth);
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
    return (
        <>
            {groups &&
            <>
                <Container>
                    <Container className={'courseInfoContainer'}>
                        <Typography className={'courseInfoTitle'}>Выберите год обучения:</Typography>
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