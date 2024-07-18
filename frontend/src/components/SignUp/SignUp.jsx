import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react'
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const passRegex = `${/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*[\]{}()?"\\,><':;|_~`=+-])[a-zA-Z\d!@#$%^&*[\]{}()?"\\,><':;|_~`=+-]{12,99}$/}`

const signInSchema = Yup.object().shape({
  username: Yup.string().required('El nombre de usuario es requerido'),
  email: Yup.string().email('El formato no es correcto').required('El correo electrónico es requerido'),
  password: Yup.string().required('La contraseña es requerida').matches(passRegex, 'Debe contener al menos 12 caracteres, 1 mayúscula, 1 minúscula, 1 caracter especial y 1 número'),
  passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
});

function SignUp() {
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(signInSchema)
  })
  
  return (
    <div className='signIn'>
      <Form onSubmit={handleSubmit((data) => console.log(data))}>
      
      <Form.Group className="mb-3">
        <Form.Label htmlFor='username'>Nombre de usuario</Form.Label>
        <Form.Control type="text" placeholder="UserName" id='username' {...register('username')} />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label htmlFor='email'>Correo electrónico</Form.Label>
        <Form.Control type="email" placeholder="example@email.com" id='email' {...register('email')} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="password">Contraseña</Form.Label>
        <Form.Control type="password" placeholder="********" id='password' {...register('password')} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="passwordConfirmation">Confirmar Contraseña</Form.Label>
        <Form.Control type="password" placeholder="********" id='passwordConfirmation' {...register('passwordConfirmation')} />
      </Form.Group>

      <div className="d-grid gap-2">
      <Button variant="dark" type="submit">
        Registrarme
      </Button>
      </div>
    </Form>
    </div>
  )
}

export default SignUp