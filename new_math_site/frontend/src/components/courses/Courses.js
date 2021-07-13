import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { getCourses, enrollCourse } from '../../actions/courses';

export class Courses extends Component {
    static propTypes = {
        courses: PropTypes.object.isRequired,
        getCourses: PropTypes.func.isRequired,
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
                   </table>
            </Fragment>
            
        )
    }
}

const mapStateToProps = state => (
    {
        courses: state.courses
    }
)

export default connect(mapStateToProps, { getCourses, enrollCourse })(Courses);