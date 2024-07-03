import React from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
// import './lib/dev-rest'

const root = createRoot(document.getElementById('root'));
root.render(<App />);
