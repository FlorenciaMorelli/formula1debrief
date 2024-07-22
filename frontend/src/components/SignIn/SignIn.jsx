import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AUTH_URL = process.env.REACT_APP_AUTH_URL || 'http://localhost:3001/auth';

const signInSchema = Yup.object().shape({
  email: Yup.string().email('El formato no es correcto').required('El correo electrónico es requerido'),
  password: Yup.string().required('La contraseña es requerida')
});

function SignIn({ onLogin }) {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(signInSchema)
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${AUTH_URL}/login`, data);
      onLogin(response.data);
      if (response.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (error) {
      setErrorMessage(error.response.data.error || 'Ocurrió un error. Intente nuevamente.');
    }
  };

  return (
    <div className='signIn'>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}
        <Form.Group className="mb-3">
          <Form.Label htmlFor='email'>Correo electrónico</Form.Label>
          <Form.Control type="email" placeholder="example@email.com" id='email' {...register('email')} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Contraseña</Form.Label>
          <Form.Control type="password" placeholder="********" id='password' {...register('password')} />
        </Form.Group>
        <div className="d-grid gap-2">
          <Button variant="dark" type="submit">Ingresar</Button>
        </div>
      </Form>
    </div>
  );
}

export default SignIn;