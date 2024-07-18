import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { readComments, editComment, deleteComment, resetComment } from '../../redux/reducers/commentsReducer.js';
import CommentForm from './CommentForm.jsx';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const Comments = () => {
    const comments = useSelector((state) => state.comments.data);
    const reviews = useSelector((state) => state.reviews.data);
    const users = useSelector((state) => state.users.data);
    const dispatch = useDispatch();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingId, setEditingId] = useState(null);


    useEffect(() => {
        dispatch(readComments());
    }, [dispatch]);

    const handleShowCreateModal = () => {
        setEditingId(null);
        dispatch(resetComment());
        setShowCreateModal(true);
    };
    
    const handleShowEditModal = (id) => {
        setEditingId(id);
        dispatch(editComment({ id: id }));
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setEditingId(null);
        dispatch(resetComment());
        setShowCreateModal(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
            dispatch(deleteComment(id)).then(() => dispatch(readComments()));
        }
    };


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
                            <th scope="col">Usuario que realizó el comentario</th>
                            <th scope="col">Comentario</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {comments && comments.map((comment) => (
                            <tr key={comment.id}>
                                <th scope="row">{comment.id}</th>
                                {
                                    reviews && reviews.map((review) => {
                                        if (comment.reviewId === review.id) {
                                            return <td>{ review.comment }</td>
                                        }
                                    })
                                }
                                {
                                    users && users.map((user) => {
                                        if (comment.userId === user.id) {
                                            return <td>{ user.username }</td>
                                        }
                                    })
                                }
                                <td>{comment.comment}</td>
                                <td>
                                <button type="button" className="btn btn-primary mx-1" onClick={() => handleShowEditModal(comment.id)}>Editar</button>
                                <button type="button" className="btn btn-danger mx-1" onClick={() => handleDelete(comment.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingId ? 'Editar comentario' : 'Crear nuevo comentario'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CommentForm id={editingId} handleCloseModal={handleCloseCreateModal} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Comments;
