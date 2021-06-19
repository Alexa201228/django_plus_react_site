import React, { Fragment } from 'react'
import UserForm from './UserForm';
import Courses from './Courses';

export default function Dashboard() {
    return (
        <Fragment>
            <UserForm />
            <Courses />
        </Fragment>
    )
}
