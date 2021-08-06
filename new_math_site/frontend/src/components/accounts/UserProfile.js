import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Avatar, Box, CssBaseline, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(3),
      display: 'flex',
      alignItems: 'center'
    },
    avatar: {
      margin: theme.spacing(3),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

export function UserProfile(props) {
    
    const style = useStyles();

    const { user } = props;
        return (
        <Fragment>
            {user && 
            <Container component='main'>
                <CssBaseline/>
                <div className={style.paper}>
                <Avatar className={style.avatar}>
                    <AccountCircleIcon/>
                </Avatar>
                <Typography>
                 {
                     `Welcome ${user.first_name}`}
                 </Typography>
                </div>
                
            
            
                
                <Box p={4}>
                    
                
                 <Box>
                     {user.student_courses.map((course, index) => (
                         <Box
                         key={index}>
                             <Typography
                             paragraph={true}>
                             </Typography>
                         </Box>
                     ))}
                 </Box>
             </Box>
             </Container>}
            </Fragment>
        );
    }
UserProfile.propTypes = {
    courses: PropTypes.array,
    user: PropTypes.object.isRequired
}
const mapStateToProps = (state) => ({
    courses: state.courses.courses.results,
    user: state.auth.user
});
export default connect(mapStateToProps)(UserProfile);