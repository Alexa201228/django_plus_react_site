import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {Link, Outlet, useParams} from "react-router-dom";
import {getGroupsByYear} from "../../actions/auth";
import {Button, Container, Typography} from "@material-ui/core";

export function MentorGroupsPage() {
    const {groupsByYear} = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const {test_id, year} = useParams();
    useEffect(() => {
        dispatch(getGroupsByYear({year: year}))
    }, [year])

    return (
        <>
            {groupsByYear &&
            <>
                <Container>
                    <Container className={'courseInfoContainer'}>
                        <Typography className={'courseInfoTitle'}>Выберите группу:</Typography>
                    </Container>
                    <Container
                        component={Link}
                        to={`/lessons-list/tests/${test_id}`}
                        className={'backLinkContainer'}>
                        <Typography className={'backLinkText'}>Назад</Typography>
                    </Container>
                    <Container>
                        {groupsByYear.map((group, index) => (
                            <Button
                                className={'yearButton'}
                                key={index}
                                component={Link}
                                to={`${group.group_name}`}>
                                {group.group_name}
                            </Button>
                        ))}
                    </Container>
                </Container>
                <Outlet/>
            </>}

        </>
    )
}
