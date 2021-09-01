import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Fragment } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Container } from '@material-ui/core';


const useStyles = makeStyles(() => ({
  spinnerContainer: {
    alignContent: 'center',
    justifyContent: 'center'
  }
}))


const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (auth.isLoading) {
        const style = useStyles();
        return (
          <Fragment>
            <Container className={style.spinnerContainer}>
              <CircularProgress/>
            </Container>
          </Fragment>
        );
      } else if (!auth.isVerified) {
        return <Redirect to="/login" />;
      } else {
        return <Component {...props} />;
      }
    }}
  />
);

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);