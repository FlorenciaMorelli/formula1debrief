import React from 'react'
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux'
import store from './redux/store';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Login from './pages/Login';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import { LoginProvider } from './context/LoginContext';

function PrivateRoute({ children, role }) {
  const auth = useSelector((state) => state.auth);

  if (!auth.isAutenticated) {
    return <Navigate to="/login" />;
  }

  if (auth.role !== role) {
    return <Navigate to={auth.role === 'admin' ? "/admin" : "/home"} />
  }

  return children;
}

function App() {
  return (
    <LoginProvider>


      <Provider store={store}>
        <Router>
          <Routes>
            <Route index element={<Landing />} />
            <Route path='/login' element={<Login />} />
            <Route
              path='/home'
              element={
                <PrivateRoute role="user">
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path='/admin'
              element={
                <PrivateRoute role="admin">
                  <Admin />
                </PrivateRoute>
              }
            />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Router>
      </Provider>
    </LoginProvider>
  )
}

export default App