import React, {Fragment, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import StudentProfile from "./StudentProfile";
import {MentorMainPage} from "../mentors/MentorMainPage";

import {Navigate} from "react-router-dom";
import {getCourses} from "../../actions/courses";


export function UserProfile() {

    const { user, isMentor } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCourses())
    }, [])
    if (!user) {
        return <Navigate to={'/student-login'}/>;
    }
    
        return (
        <Fragment>
            {isMentor ? <MentorMainPage/> : <StudentProfile/>}
            </Fragment>
        );
    }


export default UserProfile;