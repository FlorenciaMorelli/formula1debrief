import React from 'react'
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import exampleImage from '../assets/images/example-page.png'

function Landing() {
  return (
    <div className='landing'>
      <div className="left">
        <h1 className='gradient-text'>Formula 1 Debrief</h1>
        <h4>La Experiencia Definitiva de Fórmula 1</h4>
        <p>Manténgase actualizado con las últimas noticias, resultados de carreras y reseñas de expertos del mundo de la Fórmula 1.</p>
        <div className='btn-group-landing'>
          <Button className='btn-landing'>
            <Link className='link-landing' to='/login'>Iniciar Sesión</Link>
          </Button>
          <Button className='btn-landing'>
            <Link className='link-landing' to='/login'>Registrarse</Link>
          </Button>
        </div>
      </div>
      <div className='right'>
        <img className='img-landing' src={exampleImage} alt
          ='Home Page View' />
      </div>
    </div>
  )
}

export default Landing