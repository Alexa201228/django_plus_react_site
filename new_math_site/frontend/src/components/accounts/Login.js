import React, { useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';


const loginStyles = makeStyles((theme) => ({
  input: {
    width: '100%'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


export function Login(props) {
  
  const [userCredentials, setUserCredentials] = useState({
    email: '',
    password: '',
  })
  
  const history = useHistory();

  const onSubmit = (e) => {
    e.preventDefault();
    props.login(userCredentials.email, userCredentials.password);
  };

  const onChange = (e) => {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value })
  };

  const logStyle = loginStyles();

  if (props.isAuthenticated) {
      return <Redirect to="/" />;
  }
  
  return (
      <Container p={2}>
      <div className="col-md-6 m-auto">
        <div className="card card-body mt-5">
          <h2 className="text-center">Login</h2>
          <form onSubmit={onSubmit}>
            <Box my={2}>
              <TextField
                autoComplete="email"
                className={logStyle.input}
                type="email"
                name="email"
                label="Email"
                onChange={onChange}
                value={userCredentials.email}
                variant="filled"
                autoFocus
              />
            </Box>
            <Box my={2}>
              <TextField
                autoComplete="current-password"
                className={logStyle.input}
                type="password"
                name="password"
                label="Password"
                onChange={onChange}
                value={userCredentials.password}
                variant="filled"
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={logStyle.submit}
              size="large"
            >
              Login
            </Button>
            <Typography paragraph={true}>
              Don't have an account? <Link to="/register">Register</Link>
            </Typography>
          </form>
        </div>
      </div>
      </Container>
      
    );
  }

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});
  
export default connect(mapStateToProps, { login })(Login);