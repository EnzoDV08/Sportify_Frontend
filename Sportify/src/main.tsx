import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Components/App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <script src="https://cdn.tailwindcss.com/?v=4.1.0"></script>
    <App />
  </React.StrictMode>
)
