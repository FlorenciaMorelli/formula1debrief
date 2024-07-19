import React, { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from '../redux/reducers/authSlice';
import SignIn from '../components/SignIn/SignIn';
import SignUp from '../components/SignUp/SignUp';
import { BsChevronLeft } from "react-icons/bs";
import LoginContext from '../context/LoginContext';

function Login() {
  const { loginMode } = useContext(LoginContext);
  const [activeLog, setActiveLog] = useState('signin');
  const dispatch = useDispatch();

  useEffect(() => {
    if (loginMode) {
      setActiveLog(loginMode);
    }
  }, [loginMode]);

  const handleLogChange = (log) => {
    setActiveLog(log);
  }

  const handleLogin = (role) => {
    dispatch(login({ role }));
  };

  return (
    <div className='login'>
      <Link className='link-login' to='/'>
        <BsChevronLeft />
        Volver
      </Link>
      <div className='titleDiv'>
        <h1>{activeLog === 'signin' ? 'Iniciar sesión' : 'Registrarse'}</h1>
      </div>
      <div className='textDiv'>
        {
          activeLog === 'signin'
            ?
            <p>
              ¡Hola otra vez!
              <br />
              Ingresá a tu cuenta para acceder a las últimas reseñas de F1
            </p>
            :
            <p>
              ¡Bienvenido!
              <br />
              Creá tu cuenta para acceder a las últimas reseñas de F1
            </p>
        }
        {activeLog === 'signin' ? <SignIn onLogin={handleLogin} /> : <SignUp onLogin={handleLogin} />}
      </div>

      <div className='footerDiv'>
        {
          activeLog === 'signin'
            ?
            <>
              <p>¿No tenés una cuenta?</p>
              <span onClick={() => handleLogChange('signup')}>Registrate</span>
            </>
            :
            <>
              <p>¿Ya tenés una cuenta?</p>
              <span onClick={() => handleLogChange('signin')}>Iniciá sesión</span>
            </>
        }
      </div>
    </div>
  );
}

export default Login;