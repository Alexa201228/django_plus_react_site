import { GET_COURSES, ENROLL_COURSE } from '../actions/types.js';

const initialState = {
    courses: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_COURSES:
            return {
                ...state,
                courses: action.payload,
            };
        case ENROLL_COURSE:
            return {
                ...state,
                courses: state.courses.filter(course => course.slug
                    === action.payload),
            };
        default:
            return state;
    }
}