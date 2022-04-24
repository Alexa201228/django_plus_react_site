import React, { Fragment } from 'react';
import { Navigate, Outlet} from 'react-router-dom';
import { connect } from 'react-redux';

import { CircularProgress, Container } from '@material-ui/core';


const PrivateRoute = ({ auth }) => {
      if (auth.isLoading) {
        return (
          <Fragment>
            <Container style={{'width': '20em', 'height': '20em', 'justifyContent': 'center'}}>
              <CircularProgress/>
            </Container>
          </Fragment>
        );
      } if (!auth.isAuthenticated) {
        return <Navigate to="/login"/>;
      } else {
        return <Outlet />;
      }
    }

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);