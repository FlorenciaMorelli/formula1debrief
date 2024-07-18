import React from 'react'
import './App.css';
import Admin from './pages/Admin'
import { Provider } from 'react-redux'
import store from './redux/store'
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  return (
    <Provider store={store}>
      {/* <Admin /> */}
      {/* <Home /> */}
      <Login />
    </Provider>
  )
}

export default App