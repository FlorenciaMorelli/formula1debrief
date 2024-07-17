import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addReview } from '../../redux/reducers/reviewsReducer';

const ReviewForm = () => {
    const dispatch = useDispatch();
    const [race, setRace] = useState('');
    const [user, setUser] = useState('');
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addReview({ rating, comment }));
        // Clear form after submission
        setUser('');
        setRace('');
        setRating('');
        setComment('');
    };

    return (
        <div>
            <h2>Add Review</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="race" className="form-label">Carrera</label>
                    <input
                        type="text"
                        className="form-control"
                        id="race"
                        value={race}
                        onChange={(e) => setRace(e.target.value)}
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
                    <label htmlFor="rating" className="form-label">Puntuación</label>
                    <input
                        type="text"
                        className="form-control"
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
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
                <button type="submit" className="btn btn-primary">Add Review</button>
            </form>
        </div>
    );
};

export default ReviewForm;
