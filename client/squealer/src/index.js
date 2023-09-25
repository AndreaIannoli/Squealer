import React, {createContext} from 'react';
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
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Channel from "./pages/Channel";
import Explore from "./pages/Explore";
import ChannelCreation from "./pages/ChannelCreation";
import Error from "./pages/Error";
import Notifications from "./pages/Notifications";

export const router = createBrowserRouter([
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
    {
        path: "/messages",
        element: <Messages />,
    },
    {
        path: "/explore",
        element: <Explore />,
    },
    {
        path: "/notifications",
        element: <Notifications />,
    },
    {
        path: "/profiles/:username",
        element: <Profile />,
    },
    {
        path: "/channels/:name",
        element: <Channel />,
    },
    {
        path: "/channel_creation",
        element: <ChannelCreation />,
    },
    {
        path: "/error/:code/:text",
        element: <Error />,
    },
], {basename: "/"});
export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} fallbackElement={<Home />}/>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
