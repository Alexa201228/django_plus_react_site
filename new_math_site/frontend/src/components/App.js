import React, { Component, Fragment } from "react";
import { render } from "react-dom";
import Header from './layout/Header';
import Dashboard from "./courses/Dashboard";

class App extends Component {

  render() {
    return (
      <Fragment>
        <Header />
        <div className='container'>
          <Dashboard/>
        </div>
      </Fragment>
      
    );
  }
}

export default App;

const container = document.querySelector("#app");
render(<App/>, container); 
       {/* {courses.map((course, index) =>
        (
          <p key={index}>
            {course.title}
            <ul>
              {course.course_modules.map((module, i) =>(
                <li key={i}>
                  {module.module_name}
                </li>
              ))}
            </ul>
          </p>
          
        ))}
      </ul> */}