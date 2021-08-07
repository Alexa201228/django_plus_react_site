import { GET_COURSES, GET_COURSE_DETAILS } from '../actions/types.js';

const initialState = {
    courses: [],
    course: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_COURSES:
            return {
                ...state,
                courses: action.payload,
            };
        case GET_COURSE_DETAILS:
            return {
                ...state,
                course: action.payload,
            };
        default:
            return state;
    }
}