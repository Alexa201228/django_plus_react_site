import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';


export default function UserProfile() {
    
    const user = useSelector(state => state.auth.user);

        return (
            <Fragment>
                <Typography paragraph={true}>
                    {
                        `Welcome ${user.first_name}`}
            </Typography>
            </Fragment>
        );
    }
