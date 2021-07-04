import React, { Component } from 'react'

export class UserForm extends Component {
    state = {
        name: '',
        surname: '',
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
        const { name, surname, email } = this.state;
        return (
            <div className="card card-body mt-4 mb-4">
                <h1>Registration form</h1>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <label>Name</label>
                        <input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={this.onChange}
                        value={name}
                        />  
                    </div>
                    <div className="form-group">
                      <label>Surname</label>
                        <input
                        className="form-control"
                        type="text"
                        name="surname"
                        onChange={this.onChange}
                        value={surname}
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