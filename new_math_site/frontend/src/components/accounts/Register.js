import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Fragment } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from "@hookform/error-message";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';

import { register } from '../../actions/auth';
import { REQUIRED_FIELD } from '../../helpers/editContentHelper';

const useStyles = makeStyles((theme) => ({
  formContainer: {
    [theme.breakpoints.down('xs')]: {
      marginTop:theme.spacing(11)
    }
  },
  form: {
    width: '100%', 
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


export function Register(props) {
  
  //Define controls for form validation
  const { control,
    formState,
    formState: { errors },
    handleSubmit,
    watch
  } = useForm({
    mode: "onChange",
    criteriaMode: "all"
  });

 //Add watch on input fields to get values
  const first_name = watch('first_name');
  const email = watch('email');
  const password = watch('password');
  
  const classes = useStyles();
  
  function onSubmit() {
      const newUser = {
        first_name,
        email,
        password
      };
      props.register(newUser);
  }

  if (props.isAuthenticated) {
      return <Redirect to='/login' />;
  }



  return (
    <Fragment>
      <Container className={classes.formContainer}>
      <CssBaseline />
      <div className='col-md-6 m-auto'>
        <div className='card card-body mt-5'>
          <h2 className='text-center'>Register</h2>
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <div className="container">
              <Box my={2}>
              <Controller
                  render={({ field }) =>
                    <TextField
                      {...field}
                    label="First Name"
                    fullWidth
                        variant="filled"
                        autoComplete="on"
                        autoFocus
                  />}
                    name="first_name"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: REQUIRED_FIELD              
                      } 
                    }}
                    defaultValue=""
                />
                <ErrorMessage
                  errors={errors}
                  name="first_name"
                  render={({ messages }) => {
                  return messages
                  ? Object.entries(messages).map(([type, message]) => (
                    <Typography
                    paragraph={true}
                    style={{ color: 'red' }}
                    key={type}>{message}</Typography>
                  ))
                  : null;
                  }}
                />
              </Box> 
              <Box my={2}>
                <Controller
                  render={({ field }) =>
                    <TextField
                      {...field}
                      fullWidth
                      variant="filled"
                      label="Email"
                    />}
                  control={control}
                  name="email"
                  rules={{
                    required: {
                      value: true,
                      message: REQUIRED_FIELD
                    }, 
                    pattern: {
                      value: /^(([^<>()\[\]\.,;:\s@\']+(\.[^<>()\[\]\.,;:\s@\']+)*)|(\'.+\'))@(([^<>()[\]\.,;:\s@\']+\.)+[^<>()[\]\.,;:\s@\']{2,})$/i,
                      message:"Please enter valid email"
                      } 
                  }}
                  defaultValue=""
                > 
                </Controller>
                <ErrorMessage
                  errors={errors}
                  name="email"
                  render={({ messages }) => {
                  return messages
                  ? Object.entries(messages).map(([type, message]) => (
                    <Typography
                    paragraph={true}
                    style={{ color: 'red' }}
                    key={type}>{message}</Typography>
                  ))
                  : null;
                  }}
                />
              </Box>
              <Box my={2}>
                <Controller
                  render={({ field }) =>
                    <TextField
                      {...field}
                      fullWidth
                      variant="filled"
                        label="Password"
                      type="Password"/>}
                  control={control}
                  name="password"
                  rules={{
                    required: true,
                    minLength: {
                      value: 9,
                      message: "Пароль должен содержать минимум 9 символов"
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/,
                      message: "Пароль должен содержать хотя бы одну СТРОЧНУЮ букву, одну прописную, "
                        + " хотя бы одну цифру и один специальный символ [!#$%^&*]"
                    },                      
                  }}
                  defaultValue="">

                </Controller>

                <ErrorMessage
                  errors={errors}
                  name="password"
                  render={({ messages }) => {
                  return messages
                  ? Object.entries(messages).map(([type, message]) => (
                    <Typography
                      paragraph={true}
                      style={{ color: 'red' }}
                      key={type}>{message}</Typography>
                  ))
                : null;
                }}
              />
              </Box>
                <Button variant="contained" type='submit' color="primary" className={classes.submit}
                disabled={!formState.isValid}>
                Register
              </Button>
            <Typography paragraph={true}>
              Already have an account? <Link to='/login'>Login</Link>
            </Typography>
            </div>
          </form>
        </div>
        </div>
      </Container>
    </Fragment>
      
    );
  }


Register.propTypes = {
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { register })(Register);