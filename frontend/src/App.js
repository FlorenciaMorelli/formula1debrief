import React from 'react'
import './App.css';
import Admin from './pages/Admin'
import { Provider } from 'react-redux'
import store from './redux/store'
import Home from './pages/Home';

function App() {
  return (
    <Provider store={store}>
      {/* <Admin /> */}
      <Home />
    </Provider>
  )
}

export default App