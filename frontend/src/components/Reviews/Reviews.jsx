import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { listReviews } from '../../redux/reducers/reviewsReducer.js';
import ReviewForm from './ReviewForm.jsx';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const Reviews = () => {
    const reviews = useSelector((state) => state.reviews.data);
    const dispatch = useDispatch();
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        dispatch(listReviews());
    }, [dispatch]);

    const handleShowCreateModal = () => setShowCreateModal(true);
    const handleCloseCreateModal = () => setShowCreateModal(false);

    return (
        <div>
            <h1>Listado de Carreras</h1>
            <Button variant="primary" onClick={handleShowCreateModal}>
                Crear Nuevo
            </Button>
            <div className="table-responsive">
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Carrera</th>
                            <th scope="col">Usuario</th>
                            <th scope="col">Puntuación</th>
                            <th scope="col">Comentario</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {reviews && reviews.map((review) => (
                            <tr key={review.id}>
                                <th scope="row">{review.id}</th>
                                <td>{review.raceId}</td>
                                <td>{review.userId}</td>
                                <td>{review.rating} / 5</td>
                                <td>{review.comment}</td>
                                <td>
                                    <button type="button" className="btn btn-primary mx-1">Editar</button>
                                    <button type="button" className="btn btn-danger mx-1">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para crear nueva carrera */}
            <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Nueva Carrera</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ReviewForm handleCloseModal={handleCloseCreateModal} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Reviews;
