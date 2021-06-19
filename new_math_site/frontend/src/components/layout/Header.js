import React, { Component } from "react";
import { render } from "react-dom";

class Header extends Component{
    constructor(props) {
        super(props);
        this.state = {
          data: [],
          loaded: false,
          placeholder: "Loading"
        };
    }

        componentDidMount() {
            fetch("api/courses/")
              .then(response => {
                if (response.status > 400) {
                  return this.setState(() => {
                    return { placeholder: "Something went wrong!" };
                  });
                }
                return response.json();
              })
              .then(data => {
                this.setState(() => {
                  return {
                    data,
                    loaded: true
                  };
                });
              });
          }

          render() {
            var courses = this.state.data;
            return (
                <nav className="navbar navbar-expand-lg navbar-light bg-light" >
                   <div className="container-fluid">
                        <a className="navbar-brand" href="#">Math logo</a>
                         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Courses
                            </a>
                
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                {courses.map(course => (
                                <li><a className="dropdown-item" href="#">{course.title}</a></li>
                                ))}
                            </ul>
                            </li>
                        </ul>
                    </div>
                    </div>    
                </nav>
            );
          }
        
}

export default Header;