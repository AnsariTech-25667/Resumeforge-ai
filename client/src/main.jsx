/*
  Resume Builder
  Built & Designed by Maaz Ansari
  Website: https://maazansari.example.com
  Email: maaz.ansari@example.com
*/

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import { store } from './app/store.js'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
)
