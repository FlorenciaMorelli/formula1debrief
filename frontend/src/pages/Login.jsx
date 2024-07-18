import React from 'react'
import SignIn from '../components/SignIn/SignIn'
import Button from 'react-bootstrap/esm/Button'

function Login() {
  return (
    <div className='login'>
      <div className='titleDiv'>
        <h1>Iniciar sesión</h1>
      </div>
      <div className='textDiv'>
        <p>
          Bienvenido nuevamente!
          <br />
          Ingresa a tu cuenta para acceder a las últimas reseñas de F1
        </p>
        <SignIn />
      </div>

      <div className='footerDiv'>
        <span className='text'>¿Aún no estás registrado?</span>
        <Button variant='dark' size='sm'>Registrarme</Button>
      </div>
    </div>
  )
}

export default Login