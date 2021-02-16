import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import './index.css';
import Routes from './Routes';
import Client from './client';
import reportWebVitals from './reportWebVitals';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={Client}>
      <Router>
        <Routes />
      </Router>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
