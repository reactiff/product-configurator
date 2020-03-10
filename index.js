import React from 'react';
import ReactDOM from 'react-dom';

import './css/index.css';
import './css/app.css';
import './css/flex.css';
import './css/declarative.css';

import App from './App';

import { BrowserRouter } from 'react-router-dom';

ReactDOM.render((
    // <BrowserRouter> 
        <App />
    // </BrowserRouter> 
), document.getElementById('root'));
