import React, { useEffect, Fragment } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';

import { Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { ErrorMessage } from "@hookform/error-message";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { emailVerified, resendEmailVerificationLink } from '../../actions/auth';
import { EMAIL_TEXTFIELD_VALIDATOR, REQUIRED_FIELD } from '../../helpers/editContentHelper';


const useStyles = makeStyles((theme) => ({
    contentContainer: {
        marginTop: theme.spacing(3),
        [theme.breakpoints.down('xs')]: {
            marginTop: theme.spacing(12),
        }
    },
    emailVerificationContainer: {
        backgroundColor: 'lightgreen',
    }
}))

export function EmailVerified(props) {

    const dispatch = useDispatch();
    const styles = useStyles();
    const { isVerified } = useSelector(state => state.auth);
    const { control,
        formState,
        formState: { errors },
        handleSubmit,
        watch
      } = useForm({
        mode: "onChange",
        criteriaMode: "all"
      });
    const email = watch('email');

    useEffect(() => {
        dispatch(emailVerified(props.match.params.token))
    }, [])

    //Отправить ссылку на активацию повторно
    const resendVerificationLink = () => {
        props.resendEmailVerificationLink(email);
    }
    //Если ссылка действительна
  const activeAccessLink = (
      <Container className={styles.emailVerificationContainer}>
                    Email успешно подтвержден!
        </Container>
  );
    //Если ссылка недействительна, отправляем новую
  //с новым токеном на email 
  const expiredAccessLink = (
    <Container>
      <Typography>
        Что-то пошло не так( Пожалуйста, введите свой
        email и нажмите на кнопку
        ниже для повторной отправки активации аакаунта
      </Typography>
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
              message: EMAIL_TEXTFIELD_VALIDATOR
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
      <Container>
        <Button
          onClick={handleSubmit(resendVerificationLink)}
          disabled={!formState.isValid}>
          Отправить письмо повторно
        </Button>
      </Container>
    </Container>
  );

    return (
        <Fragment>
            <Container className={styles.contentContainer}>
                {isVerified ? activeAccessLink : expiredAccessLink }
            </Container>  
        </Fragment>
    )
}

EmailVerified.propTypes = {
    resendEmailVerificationLink: PropTypes.func.isRequired,
}

export default connect(null, { resendEmailVerificationLink })(EmailVerified);