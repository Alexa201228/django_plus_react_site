import axios from "axios";

import { createMessage, returnErrorMessages } from "./messages";
import { GET_COURSES, ENROLL_COURSE } from "./types";

//Get courses
export const getCourses = () => dispatch => {
    axios
        .get('/api/courses/')
        .then(res => {
            dispatch({
                type: GET_COURSES,
                payload: res.data.results
            });
        }).catch(err => {
            dispatch(returnErrorMessages(err.response.data, err.response.status))
        });
};

//Enroll on course
export const enrollCourse = (slug) => dispatch => {
    axios.get(`/api/courses/${slug}/`)
        .then(res => {
            dispatch(createMessage('You have joined course!'))
            dispatch({
                type: ENROLL_COURSE,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrorMessages(err.response.data, err.response.status));
        });
}
