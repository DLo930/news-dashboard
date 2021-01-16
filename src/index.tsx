import React from 'react';
import { render } from 'react-dom';
import App from './App';
import './App.global.css';

// Configure secrets
require('dotenv').config();

render(<App />, document.getElementById('root'));
