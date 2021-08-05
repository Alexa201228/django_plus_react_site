import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Box, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';


export function UserProfile(props) {
    
    const { user } = props;
    console.log(user)
        return (
            <Fragment>
                {user && 
                <Box p={4}>
                    
                <Typography paragraph={true}>
                 {
                     `Welcome ${user.first_name}`}
                 </Typography>
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
             </Box>}
                
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