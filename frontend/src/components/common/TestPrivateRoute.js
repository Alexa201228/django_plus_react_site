import React, { Fragment } from 'react';
import { Navigate, Outlet} from 'react-router-dom';
import { connect } from 'react-redux';

import { CircularProgress, Container } from '@material-ui/core';


const TestPrivateRoute = ({ auth, course }) => {
      if (auth.isLoading) {
        return (
          <Fragment>
            <Container style={{'width': '20em', 'height': '20em', 'justifyContent': 'center', 'marginTop': '20em'}}>
              <CircularProgress/>
            </Container>
          </Fragment>
        );
      }
      if (!auth.user.student_courses.some(c => course.course.id === c.id)) {
        return <Navigate to={`${course.course.slug}`}/>;
      } else {
        return <Outlet />;
      }
    }

const mapStateToProps = (state) => ({
    auth: state.auth,
    course: state.courses
});

export default connect(mapStateToProps)(TestPrivateRoute);