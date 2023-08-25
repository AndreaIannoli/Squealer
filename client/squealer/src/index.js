import React from 'react';
import ReactDOM from 'react-dom/client';

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
// Icons
import 'bootstrap-icons/font/bootstrap-icons.css';
// JQuery
import $ from 'jquery';
// Popper
import Popper from 'popper.js';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Navbar from "./components/Navbar";
import ScrollPane from "./components/ScrollPane";
import SidePane from "./components/SidePane";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <div className='container-fluid'>
          <div className='row flex-column flex-md-row'>
              <div className='col-12 col-md-3 col-lg-2 p-0'><Navbar /></div>
              <div className='col-12 col-md-9 col-lg-7 p-0 z-0'><ScrollPane /></div>
              <div className='col-lg-3 d-none d-lg-inline-block p-0 z-0'><SidePane /></div>
          </div>
      </div>
      <div className='vr'></div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
