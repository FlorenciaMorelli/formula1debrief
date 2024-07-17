import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { listUsers } from '../../redux/reducers/usersReducer.js';
import UserForm from './UserForm.jsx';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const Users = () => {
    const users = useSelector((state) => state.users.data);
    const dispatch = useDispatch();
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        dispatch(listUsers());
    }, [dispatch]);

    const handleShowCreateModal = () => setShowCreateModal(true);
    const handleCloseCreateModal = () => setShowCreateModal(false);

    return (
        <div>
            <h2>Listado de Usuarios</h2>
            <Button variant="primary" onClick={handleShowCreateModal}>
                CREAR USUARIO
            </Button>
            <div className="table-responsive">
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Nombre de usuario</th>
                            <th scope="col">correo electrónico</th>
                            <th scope="col">Contraseña</th>
                            <th scope="col">Rol</th>
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
                                    <button type="button" className="btn btn-primary mx-1">Editar</button>
                                    <button type="button" className="btn btn-danger mx-1">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para crear nuevo usuario */}
            <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear nuevo usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <UserForm handleCloseModal={handleCloseCreateModal} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Users;
