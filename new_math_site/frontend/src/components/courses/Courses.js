import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { getCourses, enrollCourse } from '../../actions/courses';

export class Courses extends Component {
    static propTypes = {
        courses: PropTypes.array.isRequired,
        getCourses: PropTypes.func.isRequired,
        enrollCourse: PropTypes.func.isRequired,
    }
    componentDidMount() {
        this.props.getCourses();
}
    render() {
        return (
            <Fragment>
                <h1>Here are Courses</h1>
                <table className="table table-striped">
                    <thead>
                        <th>Title</th>
                        <th>Modules</th>
                        <th>Enroll</th>
                    </thead>
                    <tbody>
                        {this.props.courses.map((course, index) =>
                            (
                            <tr key={index}>
                                <td>{course.title}</td>
                                <td><ul>
                                {course.course_modules.map((module, i) =>(
                                    <li key={i}>
                                    {module.module_name}
                                    </li>
                            ))}
                                </ul>
                                </td>
                                <td>
                                    <button onClick=
                                        {this.props.enrollCourse.bind(
                                            this, course.slug
                                        )}
                                        className="btn btn-success">
                                        Enroll course
                                    </button>
                                </td>
                            </tr>
          
                            ))}
                    </tbody>
                </table>
            </Fragment>
            
        )
    }
}

const mapStateToProps = state => (
    {
        courses: state.courses.courses
    }
)

export default connect(mapStateToProps, { getCourses, enrollCourse })(Courses);