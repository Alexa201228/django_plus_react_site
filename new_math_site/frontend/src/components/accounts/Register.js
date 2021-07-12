import '../styles/register.css';
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../../actions/auth';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from "@hookform/error-message";


export function Register(props) {
  const { register,
    handleSubmit,
    formState,
    formState: { errors },
    watch
  } = useForm({
    mode: 'onChange',
    criteriaMode: "all"
  });
 
  const first_name = watch('first_name');
  const email = watch('email');
  const password = watch('password');
  
  function onSubmit() {
    if (password === null) {
      alert('Some credentials does not suit requirements')
    }
    else {
      const newUser = {
        first_name,
        email,
        password
      };
      props.register(newUser);
    }
  }

  if (props.isAuthenticated) {
      return <Redirect to='/' />;
  }
  
  return (
    <Fragment>
      <div className='col-md-6 m-auto'>
        <div className='card card-body mt-5'>
          <h2 className='text-center'>Register</h2>
          <form className='justify-content-center align-items-center' onSubmit={handleSubmit(onSubmit)}>
              <div className='container'>
              <label className='custom-field'>
                <span>First name</span>
                <input
                  name='first_name'
                  {...register('first_name', {
                      required: true
                    })}
                    placeholder='First name'
                />
                {errors.first_name && <i>This field is required</i>}
              </label>
              <label className='custom-field'>
                <span>Enter Email</span>
                <input
                  {...register('email', {
                      required: true,
                    pattern: {
                      value: /^(([^<>()\[\]\.,;:\s@\']+(\.[^<>()\[\]\.,;:\s@\']+)*)|(\'.+\'))@(([^<>()[\]\.,;:\s@\']+\.)+[^<>()[\]\.,;:\s@\']{2,})$/i,
                      message:"Please enter valid email"
                      } 
                  })}
                  style={{ borderColor: errors.email && "red" }}
                  placeholder='Enter Email'
                />
                <ErrorMessage
                  errors={errors}
                  name="email"
                  render={({ messages }) => {
                  return messages
                  ? Object.entries(messages).map(([type, message]) => (
                    <p style={{ color: 'red'}} key={type}>{message}</p>
                  ))
                  : null;
                  }}
                />
              </label>
              <label className='custom-field'>
                <span>Password</span>
                <input
                  {...register('password', {
                    required: true,
                    minLength: {
                      value: 9,
                      message: "Password should contain at least 9 symbols"
                    },
                      pattern: {
                        value: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})$/i,
                        message: "Password should contain at least one uppercase letter, one lowercase "
                          + "letter, one digit and one special character [!@#$%^&()]"
                    },                     
                  })}
                  placeholder="Password"
                />
                <ErrorMessage
                  errors={errors}
                  name="password"
                  render={({ messages }) => {
                  return messages
                  ? Object.entries(messages).map(([type, message]) => (
                    <p key={type}>{message}</p>
                  ))
                : null;
                }}
              />              
              </label>
                <button type='submit' className='btn btn-primary'
                disabled={!formState.isValid}>
                Register
              </button>
            <p>
              Already have an account? <Link to='/login'>Login</Link>
            </p>
              </div>
              
          </form>
        </div>
      </div>
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