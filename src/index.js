/** @jsxImportSource @emotion/react */
import { css, Global } from '@emotion/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Global
      styles={css`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        body {
          color: #000;
          font-family: 'Cairo Play', cursive;
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
          overflow-x: hidden;
          position: relative;
          margin: 10px;
        }
      `}
    />
    <App />
  </React.StrictMode>,
);

reportWebVitals();
