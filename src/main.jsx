import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.css'

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element with id 'root' not found.");
}
