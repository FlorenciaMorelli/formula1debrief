import React from 'react'
import './App.css';
import Admin from './pages/Admin'
import { Provider } from 'react-redux'
import store from './redux/store'

function App() {
  return (
    <Provider store={store}>
      <Admin />
    </Provider>
  )
}

export default App