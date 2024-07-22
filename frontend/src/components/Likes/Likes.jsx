import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { readLikes, editLike, deleteLike, resetLike } from '../../redux/reducers/likesReducer.js';
import LikeForm from './LikeForm.jsx';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const Likes = () => {
    const likes = useSelector((state) => state.likes.data);
    const reviews = useSelector((state) => state.reviews.data);
    const users = useSelector((state) => state.users.data);
    const dispatch = useDispatch();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingId, setEditingId] = useState(null);


    useEffect(() => {
        dispatch(readLikes());
    }, [dispatch]);

    const handleShowCreateModal = () => {
        setEditingId(null);
        dispatch(resetLike());
        setShowCreateModal(true);
    };
    
    const handleShowEditModal = (id) => {
        setEditingId(id);
        dispatch(editLike({ id: id }));
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setEditingId(null);
        dispatch(resetLike());
        setShowCreateModal(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este like?')) {
            dispatch(deleteLike(id)).then(() => dispatch(readLikes()));
        }
    };


    return (
        <div>
            <h2>Listado de Likes</h2>
            <Button class="btn btn-outline-success" onClick={handleShowCreateModal}>
                CREAR LIKE
            </Button>
            <div className="table-responsive">
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Reseña original</th>
                            <th scope="col">Usuario que dio el like</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {likes && likes.map((like) => (
                            <tr key={like.id}>
                                <th scope="row">{like.id}</th>
                                {
                                    reviews && reviews.map((review) => {
                                        if (like.reviewId === review.id) {
                                            return <td>{ review.comment }</td>
                                        }
                                    })
                                }
                                {
                                    users && users.map((user) => {
                                        if (like.userId === user.id) {
                                            return <td>{ user.username }</td>
                                        }
                                    })
                                }
                                <td>
                                <button type="button" class="btn btn-warning mx-1" onClick={() => handleShowEditModal(like.id)}>Editar</button>
                                <button type="button" className="btn btn-danger mx-1" onClick={() => handleDelete(like.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingId ? 'Editar like' : 'Crear nuevo like'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LikeForm id={editingId} handleCloseModal={handleCloseCreateModal} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Likes;
