import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteReview, editReview, readReviews, resetReview } from '../../redux/reducers/reviewsReducer.js';
import ReviewForm from './ReviewForm.jsx';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const Reviews = () => {
    const reviews = useSelector((state) => state.reviews.data);
    const races = useSelector((state) => state.races.data);
    const users = useSelector((state) => state.users.data);
    const dispatch = useDispatch();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingId, setEditingId] = useState(null);


    useEffect(() => {
        dispatch(readReviews());
    }, [dispatch]);

    const handleShowCreateModal = () => {
        setEditingId(null);
        dispatch(resetReview());
        setShowCreateModal(true);
    };
    
    const handleShowEditModal = (id) => {
        setEditingId(id);
        dispatch(editReview({ id: id }));
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setEditingId(null);
        dispatch(resetReview());
        setShowCreateModal(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
            dispatch(deleteReview(id)).then(() => dispatch(readReviews()));
        }
    };

    return (
        <div className="admin-reviews">
            <h2>Listado de Reseñas</h2>
            <Button variant="btn btn-outline-success" onClick={handleShowCreateModal}>
                CREAR RESEÑA
            </Button>
            <br />
            <div className="table-responsive">
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Carrera</th>
                            <th scope="col">Usuario</th>
                            <th scope="col">Puntuación</th>
                            <th scope="col">Comentario</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {reviews && reviews.map((review) => (
                            <tr key={review.id}>
                                <th scope="row">{review.id}</th>
                                {
                                    races && races.map((race) => {
                                        if (review.raceId === race.raceId) {
                                            return <td>{ race.raceName }</td>
                                        }
                                    })
                                }
                                {
                                    users && users.map((user) => {
                                        if (review.userId === user.id) {
                                            return <td>{ user.username }</td>
                                        }
                                    })
                                }
                                <td>{review.rating} / 5</td>
                                <td>{review.comment}</td>
                                <td>
                                <button type="button" class="btn btn-warning mx-1" onClick={() => handleShowEditModal(review.id)}>Editar</button>
                                <button type="button" className="btn btn-danger mx-1" onClick={() => handleDelete(review.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal id="admin-modal" show={showCreateModal} onHide={handleCloseCreateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingId ? 'Editar reseña' : 'Crear nueva reseña'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ReviewForm id={editingId} handleCloseModal={handleCloseCreateModal} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Reviews;
