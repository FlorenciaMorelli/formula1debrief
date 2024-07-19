import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import exampleImage from '../assets/images/example-page.png';
import LoginContext from '../context/LoginContext';

function Landing() {
  const navigate = useNavigate();
  const { setLoginMode } = useContext(LoginContext);

  const handleNavigate = (mode) => {
    setLoginMode(mode);
    navigate('/login');
  }

  return (
    <div className='landing'>
      <div className="left">
        <h1 className='gradient-text'>Formula 1 Debrief</h1>
        <h4>La Experiencia Definitiva de Fórmula 1</h4>
        <p>Manténgase actualizado con las últimas noticias, resultados de carreras y reseñas de expertos del mundo de la Fórmula 1.</p>
        <div className='btn-group-landing'>
          <Button className='btn-landing' onClick={() => handleNavigate('signin')}>
            Iniciar Sesión
          </Button>
          <Button className='btn-landing' onClick={() => handleNavigate('signup')}>
            Registrarse
          </Button>
        </div>
      </div>
      <div className='right'>
        <img className='img-landing' src={exampleImage} alt='Home Page View' />
      </div>
    </div>
  );
}

export default Landing;