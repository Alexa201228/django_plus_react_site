import { GET_COURSES, GET_COURSE_DETAILS, ENROLL_COURSE, GET_LESSON } from '../actions/types.js';

const initialState = {
    courses: [],
    course: null,
    lesson: null
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
        case GET_LESSON:
            return {
                ...state,
                lesson: action.payload,
            }
        case ENROLL_COURSE:
            return {
                ...state,
                course: action.payload.course
            }
        default:
            return state;
    }
}