import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addComment } from '../../redux/reducers/commentsReducer';

const CommentForm = () => {
    const dispatch = useDispatch();
    const [review, setReview] = useState('');
    const [user, setUser] = useState('');
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addComment({ review, user, comment }));
        // Clear form after submission
        setUser('');
        setReview('');
        setComment('');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="review" className="form-label">Reseña</label>
                    <input
                        type="text"
                        className="form-control"
                        id="review"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="user" className="form-label">Usuario</label>
                    <input
                        type="text"
                        className="form-control"
                        id="user"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="comment" className="form-label">Comentario</label>
                    <input
                        type="text"
                        className="form-control"
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Comment</button>
            </form>
        </div>
    );
};

export default CommentForm;
