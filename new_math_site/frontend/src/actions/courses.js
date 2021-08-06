import axios from "axios";
import { loadUser } from "./auth";

import { createMessage, returnErrorMessages } from "./messages";
import { GET_COURSES, ENROLL_COURSE, GET_COURSE_DETAILS } from "./types";

//Get courses
export const getCourses = () => dispatch => {
    axios
        .get('/api/courses/')
        .then(res => {
            dispatch({
                type: GET_COURSES,
                payload: res.data
            });
        }).catch(err => {
            dispatch(returnErrorMessages(err.response.data, err.response.status))
        });
};


//Get course details
export const courseDetails = (slug) => dispatch => {
    axios.get(`/api/courses/${slug}/`)
        .then(res => {
            dispatch({
                type: GET_COURSE_DETAILS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrorMessages(err.response.data, err.response.status));
        });
}

//Enroll course
export const enrollCourse = ({token, title, slug}) => dispatch => {
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({title, slug})
    axios.post(`/api/courses/${slug}/enroll/`, body, config)
    .then(res => {
        dispatch(createMessage({successfullEnroll: 'Вы успешно зарегистрировались на курс!'}))
        dispatch({
            type: ENROLL_COURSE
        });
    })
    .catch(err =>{
        if(err.response.status === 401){
            dispatch(createMessage({requestToLogin: 'Пожалуйста, зарегистрируйтесь для записи на курс'}));
        }
        else{
            dispatch(returnErrorMessages(err.response.data, err.response.status))
        }
        
    })
}
