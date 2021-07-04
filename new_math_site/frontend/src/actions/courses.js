import axios from "axios";

import { GET_COURSES, ENROLL_COURSE, ADD_USER } from "./types";

//Get courses
export const getCourses = () => dispatch => {
    axios.get('/api/courses/')
        .then(res => {
            dispatch({
                type: GET_COURSES,
                payload: res.data
            });
        }).catch(err => console.log(err));
};

//Enroll on course
export const enrollCourse = (slug) => dispatch => {
    axios.get('/api/courses/${slug}/')
        .then(res => {
            dispatch({
                type: ENROLL_COURSE,
                payload: slug
            });
        })
        .catch(err => console.log(err));
}

//ADD USER
export const addUser = (student) => dispatch => {
    axios
        .post('api/courses/', )
}