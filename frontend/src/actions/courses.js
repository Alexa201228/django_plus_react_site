import axios from "axios";
import {API_PATH} from "../helpers/editContentHelper";
import { createMessage, returnErrorMessages } from "./messages";
import { GET_COURSES, ENROLL_COURSE, GET_COURSE_DETAILS, GET_LESSON } from "./types";

//Get courses
export const getCourses = () => dispatch => {
    axios
        .get(`${API_PATH}/api/courses/`)
        .then(res => {
            dispatch({
                type: GET_COURSES,
                payload: res.data
            });
        }).catch(err => {
            dispatch(returnErrorMessages({error: err.response.data}, {status: err.response.status}))
        });
};


//Get course details
export const courseDetails = (slug) => dispatch => {
    console.log(slug)
    axios.get(`${API_PATH}/api/courses/${slug}/`)
        .then(res => {
            dispatch({
                type: GET_COURSE_DETAILS,
                payload: res.data
            });
        })
        .catch(err => {
            console.log(err)
            dispatch(returnErrorMessages({error: err.response.data}, {status: err.response.status}))
        });
}


//Get lesson
export const getLesson = ({slug, lesson_slug}) => dispatch =>{
    axios.get(`${API_PATH}/api/courses/${slug}/${lesson_slug}/`)
    .then(res => {
        dispatch({
            type: GET_LESSON,
            payload: res.data
        })
    })
    .catch(err => {
        console.log(err)
        dispatch(returnErrorMessages({error: err.response.data}, {status: err.response.status}))
    })
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
    axios.post(`${API_PATH}/api/courses/${slug}/enroll/`, body, config)
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
            dispatch(returnErrorMessages({error: err.response.data}, {status: err.response.status}))
        }
        
    })
}
