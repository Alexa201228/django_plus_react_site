import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@material-ui/core';


export default function UserProfile() {
    
    const user = useSelector(state => state.auth.user);

        return (
            <Fragment>
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
                                    {course.title}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
                
            </Fragment>
        );
    }
