import {useDispatch, useSelector} from "react-redux";
import {Link, Outlet, useParams} from "react-router-dom";
import {useEffect} from "react";
import {getGroupsByYear} from "../../actions/auth";
import {Button, Container, Typography} from "@material-ui/core";

export function MentorReportGroupPage() {
     const {groupsByYear} = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const {year} = useParams();
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

        </>)
}

export default MentorReportGroupPage;