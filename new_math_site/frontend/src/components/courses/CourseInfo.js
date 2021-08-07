import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { courseDetails } from '../../actions/courses';
import PropTypes from 'prop-types';


export function CourseInfo(props){
    console.log(props);
    return(
        <h3>Course Info</h3>
    )
}

CourseInfo.propTypes = {
    course: PropTypes.object
}

const mapStateToProps = (state) =>({
    course: state.courses.course
})

export default connect(mapStateToProps)(CourseInfo);