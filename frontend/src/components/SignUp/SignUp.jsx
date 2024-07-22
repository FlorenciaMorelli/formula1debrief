import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AUTH_URL = process.env.REACT_APP_AUTH_URL || 'http://localhost:3001/auth';

const signUpSchema = Yup.object().shape({
  username: Yup.string().required('El nombre de usuario es requerido'),
  email: Yup.string().email('El formato no es correcto').required('El correo electrónico es requerido'),
  password: Yup.string().required('La contraseña es requerida'),
  passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
});

function SignUp() {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signUpSchema)
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${AUTH_URL}/signup`, data);
      setErrorMessage('');
      setSuccessMessage('Registrado correctamente. Ya puedes iniciar sesión');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage(error.response?.data?.error || 'Ocurrió un error. Intente nuevamente.');
    }
  };

  return (
    <div className='signIn'>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}
        {successMessage && <div className='alert alert-success'>{successMessage}</div>}
        <Form.Group className="mb-3">
          <Form.Label htmlFor='username'>Nombre de usuario</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="UserName" 
            id='username' 
            {...register('username')} 
            isInvalid={!!errors.username}
          />
          <Form.Control.Feedback type="invalid">
            {errors.username?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor='email'>Correo electrónico</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="example@email.com" 
            id='email' 
            {...register('email')} 
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Contraseña</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="********" 
            id='password' 
            {...register('password')} 
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="passwordConfirmation">Confirmar Contraseña</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="********" 
            id='passwordConfirmation' 
            {...register('passwordConfirmation')} 
            isInvalid={!!errors.passwordConfirmation}
          />
          <Form.Control.Feedback type="invalid">
            {errors.passwordConfirmation?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <div className="d-grid gap-2">
          <Button variant="dark" type="submit">Registrarme</Button>
        </div>
      </Form>
    </div>
  );
}

export default SignUp;