import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { readOneRace } from '../redux/reducers/racesReducer';
import { readReviews, createReview } from '../redux/reducers/reviewsReducer';
import Review from '../components/RacePage/Review';
import { BsChevronLeft } from 'react-icons/bs';
import { BsStarFill } from 'react-icons/bs';
import RatingStars from '../components/RacePage/RatingStars';

function RacePage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const race = useSelector((state) => state.races.data.find(race => race.raceId === parseInt(id)));
    const reviews = useSelector((state) => state.reviews.data);
    const currentUserID = useSelector((state) => state.auth.id);
    
    const [userReview, setUserReview] = useState(null);
    const [newReview, setNewReview] = useState({ rating: '', comment: '' });

    useEffect(() => {
        dispatch(readOneRace(id));
        dispatch(readReviews());
    }, [dispatch, id]);

    useEffect(() => {
        const userReview = reviews.find(review => review.raceId === parseInt(id) && review.userId === currentUserID);
        setUserReview(userReview);
    }, [reviews, id, currentUserID]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newReview.rating && newReview.comment) {
            dispatch(createReview({
                raceId: parseInt(id),
                userId: currentUserID,
                ...newReview
            })).then(() => {
                // Clear the form after submission
                setNewReview({ rating: '', comment: '' });
                
                // Fetch updated reviews after creating the review
                dispatch(readReviews());
            });
        }
    };

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString("es-ES", options)
    }

    return (
        <div className='racePage'>
            <Link className='link-back' to='/home'>
                <BsChevronLeft />
                Volver
            </Link>

            {race && (
                <>
                    <div className='racepage-info'>
                        <h1>{race.raceName}</h1>
                        <p>{formatDate(race.date).toString()}</p>
                        <p>{race.circuit}</p>
                    </div>
                    <div className='user-review-section'>
                        <h2>Tu Opinión</h2>
                        {userReview ? (
                            <div className='user-review'>
                                <div className="reviewoncard-top">
                                    <p><strong>Tu opinión:</strong></p>
                                    <p><BsStarFill /> {userReview.rating}</p>
                                </div>
                                <p className='review-text'>"{userReview.comment}"</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="review-form">
                                    <label>
                                        Rating:
                                        <RatingStars
                                            rating={newReview.rating}
                                            onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                                        />
                                    </label>
                                    <label>
                                        Comment:
                                        <textarea
                                            value={newReview.comment}
                                            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                                        />
                                    </label>
                                    <button type="submit">Submit Review</button>
                                </div>
                            </form>
                        )}
                    </div>
                    <div className='reviews'>
                        <h2>Opiniones de los usuarios</h2>
                        {reviews.filter(review => review.raceId === parseInt(id)).length > 0 ? (
                            reviews.filter(review => review.raceId === parseInt(id)).map(review => (
                                <Review key={review.id} review={review} />
                            ))
                        ) : (
                            <p>No hay opiniones disponibles.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default RacePage;