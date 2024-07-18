import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { createUser, readOneUser, readUsers, updateUser } from '../../redux/reducers/usersReducer';

const userSchema = Yup.object().shape({
    username: Yup.string().required('El nombre de usuario es requerido'),
    email: Yup.string().email().required('El correo electrónico es requerido'),
    password: Yup.string().required('La contraseña es requerida'),
    role: Yup.string().required('El rol es requerido'),
});

const UserForm = ({ id, handleCloseModal }) => {
    const dispatch = useDispatch();
    const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        resolver: yupResolver(userSchema)
    });

    const editingObj = useSelector((state) => state.users.editingObj);

    useEffect(() => {
        if (id) {
            dispatch(readOneUser(id));
        } else {
            reset();
        }
    }, [dispatch, id, reset]);

    useEffect(() => {
        if (editingObj) {
            setValue('username', editingObj.username);
            setValue('email', editingObj.email);
            setValue('password', editingObj.password);
            setValue('role', editingObj.role);
        }
    }, [editingObj, setValue]);

    const onSubmit = (data) => {
        if (id) {
            dispatch(updateUser({ id, ...data })).then(() => {
                handleCloseModal();
                dispatch(readUsers());
            });
        } else {
            dispatch(createUser(data)).then(() => {
                handleCloseModal();
                dispatch(readUsers());
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <label>Nombre de usuario</label>
                <Controller
                    control={control}
                    name="username"
                    render={({ field }) => <input type="text" className={`form-control ${errors.username ? 'is-invalid' : ''}`} {...field} />}
                />
                <div className="invalid-feedback">{errors.username?.message}</div>
            </div>
            <div className="form-group">
                <label>Correo electrónico</label>
                <Controller
                    control={control}
                    name="email"
                    render={({ field }) => <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} {...field} />}
                />
                <div className="invalid-feedback">{errors.email?.message}</div>
            </div>
            <div className="form-group">
                <label>Contraseña</label>
                <Controller
                    control={control}
                    name="password"
                    render={({ field }) => <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} {...field} />}
                />
                <div className="invalid-feedback">{errors.password?.message}</div>
            </div>
            <div className="form-group">
                <label>Rol</label>
                <Controller
                    control={control}
                    name="role"
                    render={({ field }) => <input type="text" className={`form-control ${errors.role ? 'is-invalid' : ''}`} {...field} />}
                />
                <div className="invalid-feedback">{errors.role?.message}</div>
            </div>
            <button type="submit" className="btn btn-primary">Guardar</button>
        </form>
    );
};

export default UserForm;