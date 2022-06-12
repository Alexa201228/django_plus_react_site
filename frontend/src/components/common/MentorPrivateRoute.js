import React, { Fragment } from 'react';
import { Navigate, Outlet} from 'react-router-dom';
import { connect } from 'react-redux';

import { CircularProgress, Container } from '@material-ui/core';


const MentorPrivateRoute = ({ auth }) => {
      if (auth.isLoading) {
        return (
          <Fragment>
            <Container style={{'width': '20em', 'height': '20em', 'justifyContent': 'center', 'marginTop': '20em'}}>
              <CircularProgress/>
            </Container>
          </Fragment>
        );
      } if (!auth.isMentor) {
        return <Navigate to="/mentor-login"/>;
      } else {
        return <Outlet />;
      }
    }

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(MentorPrivateRoute);