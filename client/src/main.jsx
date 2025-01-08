
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {persistor, store } from './redux/store.js'  // Import the store from the store.js file.
import { Provider } from 'react-redux' // Import the Provider from the react-redux library.
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
     <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
    
  </Provider>,
)
