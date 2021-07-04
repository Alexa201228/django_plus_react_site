import React, { Component, Fragment } from "react";
import { render } from "react-dom";

import Header from './layout/Header';
import Dashboard from "./courses/Dashboard";

import { Provider } from 'react-redux';
import store from "../store";

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Fragment>
          <Header />
          <div className='container'>
            <Dashboard/>
          </div>
        </Fragment>
      </Provider>
      
    );
  }
}

export default App;

const container = document.querySelector("#app");
render(<App/>, container); 