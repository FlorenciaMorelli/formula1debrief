import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react'
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const signInSchema = Yup.object().shape({
  email: Yup.string().email('El formato no es correcto').required('El correo electrónico es requerido'),
  password: Yup.string().required('La contraseña es requerida')
});

function SignIn({ onLogin }) {
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(signInSchema)
  })

  const onSubmit = (data) => {
    console.log(data);
    onLogin('user'); // Supongamos que el rol es 'user' por defecto
  };
  
  return (
    <div className='signIn'>
      <Form onSubmit={handleSubmit(onSubmit)}>
      
      <Form.Group className="mb-3">
        <Form.Label htmlFor='email'>Correo electrónico</Form.Label>
        <Form.Control type="email" placeholder="example@email.com" id='email' {...register('email')} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="password">Contraseña</Form.Label>
        <Form.Control type="password" placeholder="********" id='password' {...register('password')} />
      </Form.Group>

      <div className="d-grid gap-2">
      <Button variant="dark" type="submit">
        Ingresar
      </Button>
      </div>
    </Form>
    </div>
  )
}

export default SignIn