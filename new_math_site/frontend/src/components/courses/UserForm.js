import React, { Component } from 'react'

export class UserForm extends Component {
    state = {
        first_name: '',
        email: ''
    }

    onChange = e => this.setState({
        [e.target.name]: e.target.value
    });

    onSubmit = e => {
        e.preventDefault();
        console.log("submit");
    }

    render() {
        const { first_name, email } = this.state;
        return (
            <div className="card card-body mt-4 mb-4">
                <h1>Registration form</h1>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <label>First Name</label>
                        <input
                        className="form-control"
                        type="text"
                        name="first_name"
                        onChange={this.onChange}
                        value={first_name}
                        />  
                    </div>
                    <div className="form-group">
                      <label>E-mail</label>
                        <input
                        className="form-control"
                        type="text"
                        name="email"
                        onChange={this.onChange}
                        value={email}
                        />  
                    </div>
                    <div className="form-group">
                        <button type="submit"
                            className="btn btn-primary">
                            Submit
                            </button>
                    </div>
                </form>
            </div>
        )
    }
}

export default UserForm;