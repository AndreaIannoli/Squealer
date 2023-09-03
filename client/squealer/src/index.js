import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    BrowserRouter,
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import '@yaireo/tagify/dist/tagify.css';
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
import reportWebVitals from './reportWebVitals';

import axios from 'axios';

import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Login from "./pages/Login";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Registration />,
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
