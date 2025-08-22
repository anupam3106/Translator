import React from 'react';
import ReactDOM from 'react-dom'; // ✅ Correct for React 17
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'semantic-ui-css/semantic.min.css';

ReactDOM.render( // ✅ React 17 style
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
