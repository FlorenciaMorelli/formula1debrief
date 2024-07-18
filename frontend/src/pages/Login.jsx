import React, { useState } from 'react'
import SignIn from '../components/SignIn/SignIn'
import SignUp from '../components/SignUp/SignUp';
import Button from 'react-bootstrap/esm/Button'

function Login() {
  const [activeLog, setActiveLog] = useState('signin');

  const handleLogChange = (log) => {
    setActiveLog(log);
  }


  return (
    <div className='login'>
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
        {activeLog === 'signin' ? <SignIn /> : <SignUp />}
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
  )
}

export default Login