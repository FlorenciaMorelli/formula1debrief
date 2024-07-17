import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { listComments } from '../../redux/reducers/commentsReducer.js';
import CommentForm from './CommentForm.jsx';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const Comments = () => {
    const comments = useSelector((state) => state.comments.data);
    const dispatch = useDispatch();
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        dispatch(listComments());
    }, [dispatch]);

    const handleShowCreateModal = () => setShowCreateModal(true);
    const handleCloseCreateModal = () => setShowCreateModal(false);

    return (
        <div>
            <h2>Listado de Comentarios</h2>
            <Button variant="primary" onClick={handleShowCreateModal}>
                CREAR COMENTARIO
            </Button>
            <div className="table-responsive">
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Reseña original</th>
                            <th scope="col">Usuario</th>
                            <th scope="col">Comentario</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {comments && comments.map((comment) => (
                            <tr key={comment.id}>
                                <th scope="row">{comment.id}</th>
                                <td>{comment.reviewId}</td>
                                <td>{comment.userId}</td>
                                <td>{comment.comment}</td>
                                <td>
                                    <button type="button" className="btn btn-primary mx-1">Editar</button>
                                    <button type="button" className="btn btn-danger mx-1">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para crear nuevo comentario */}
            <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear nuevo comentario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CommentForm handleCloseModal={handleCloseCreateModal} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Comments;
