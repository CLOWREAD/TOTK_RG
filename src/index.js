import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter as Router, Route, Routes, RouterProvider, createBrowserRouter, createHashRouter, HashRouter, BrowserRouter } from "react-router-dom";
import { Index_Page } from './pages/index_page';


const router = createHashRouter([
  {
    path: "/",
    element: <Index_Page />,
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <HashRouter basename=''>
  <App/>
  </HashRouter>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
