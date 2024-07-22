import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { readUsers, editUser, deleteUser, resetUser } from '../../redux/reducers/usersReducer.js';
import UserForm from './UserForm.jsx';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Users = () => {
    const users = useSelector((state) => state.users.data);
    const dispatch = useDispatch();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        dispatch(readUsers());
    }, [dispatch]);

    const handleShowCreateModal = () => {
        setEditingId(null);
        dispatch(resetUser());
        setShowCreateModal(true);
    };

    const handleShowEditModal = (id) => {
        setEditingId(id);
        dispatch(editUser({ id: id }));
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setEditingId(null);
        dispatch(resetUser());
        setShowCreateModal(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar el usuario?')) {
            dispatch(deleteUser(id)).then(() => dispatch(readUsers()));
        }
    };

    return (
        <div>
            <h2>Listado de Usuarios</h2>
            <Button variant="btn btn-outline-success" onClick={handleShowCreateModal}>
                CREAR USUARIO
            </Button>
            <div className="table-responsive">
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Nombre de usuario</th>
                            <th scope="col">Correo electrónico</th>
                            <th scope="col">Contraseña</th>
                            <th scope="col">Rol del usuario</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {users && users.map((user) => (
                            <tr key={user.id}>
                                <th scope="row">{user.id}</th>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.password}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button type="button" class="btn btn-warning mx-1" onClick={() => handleShowEditModal(user.id)}>Editar</button>
                                    <button type="button" className="btn btn-danger mx-1" onClick={() => handleDelete(user.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingId ? 'Editar usuario' : 'Crear nuevo usuario'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <UserForm id={editingId} handleCloseModal={handleCloseCreateModal} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Users;