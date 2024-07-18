import React from 'react'
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div>
      <h1>Bienvenido a F1 Debrief</h1>
      <Link to="/login">Iniciar Sesión</Link>
      <Link to="/login">Registrarse</Link>
    </div>
  )
}

export default Landing