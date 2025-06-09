import { Provider } from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app/App'
import './index.css'
import orderStore from '../src/pages/order/orderRedux/store'//추가
import { PersistGate } from "redux-persist/integration/react"; // 추가
import { persistor } from "../src/pages/order/orderRedux/store"; // 추가

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={orderStore}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
