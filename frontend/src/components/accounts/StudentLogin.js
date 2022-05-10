import React, { useState } from 'react';
import {Link, Navigate} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';

import { studentLogin } from '../../actions/auth';


const loginStyles = makeStyles((theme) => ({
  formContainer: {
    [theme.breakpoints.down('xs')]: {
      marginTop:theme.spacing(11)
    }
  },
  input: {
    width: '100%'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


export function Login(props) {

  const [userCredentials, setUserCredentials] = useState({
    student_book_number: '',
    password: '',
  })

  const onSubmit = (e) => {
    e.preventDefault();
    props.studentLogin(userCredentials.student_book_number, userCredentials.password);
  };

  const onChange = (e) => {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value })
  };

  const logStyle = loginStyles();

  if (props.isAuthenticated) {
      return <Navigate to="/" />;
  }

  return (
      <Container p={2} className={logStyle.formContainer}>
      <div className="col-md-6 m-auto">
        <div className="card card-body mt-5">
          <h2 className="text-center">Вход для учащихся</h2>
          <form onSubmit={onSubmit}>
            <Box className='registerLoginInput'>
              <TextField
                className={logStyle.input}
                name="student_book_number"
                label="Номер зачетной книжки"
                onChange={onChange}
                value={userCredentials.email}
                variant="filled"
                autoFocus
              />
            </Box>
            <Box className='registerLoginInput'>
              <TextField
                autoComplete="current-password"
                className={logStyle.input}
                type="password"
                name="password"
                label="Пароль"
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
              Войти
            </Button>
            <Typography paragraph={true}>
             <Link to='/reset-password'>Забыли пароль?</Link>
            </Typography>
            <Typography paragraph={true}>
              Ещё не зарегистрированы? <Link to="/register">Зарегистрироваться</Link>
            </Typography>
          </form>
        </div>
      </div>
      </Container>

    );
  }

Login.propTypes = {
  studentLogin: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { studentLogin })(Login);