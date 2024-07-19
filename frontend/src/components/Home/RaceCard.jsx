import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { readReviews } from '../../redux/reducers/reviewsReducer';
import Card from 'react-bootstrap/Card';
import { BsStarFill } from "react-icons/bs";



function RaceCard(props) {
    const race = props.race;
    const reviews = useSelector((state) => state.reviews.data);
    const currentUserID = useSelector((state) => state.auth.id);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(readReviews());
    }, [dispatch]);

    const userReview = reviews.find( review => review.raceId === race.raceId && review.userId && currentUserID);

    return (
        <Card className='raceCard'>
            <Card.Header>
                <Card.Text className='circuit'>
                {race.circuit}
                </Card.Text>
                <Card.Text className='rating'>
                    <BsStarFill />
                    {reviews.filter(review => review.raceId === race.raceId).reduce((sum, review) => sum + review.rating, 0) / reviews.filter(review => review.raceId === race.raceId).length}
                </Card.Text>
            </Card.Header>
            <Card.Body>
                <Card.Title>{race.raceName}</Card.Title>
                <Card.Text className='date'>
                    {race.date} {race.time}
                </Card.Text>
                {userReview ? (
                    <div className='user-review'>
                        <p><strong>Tu reseña:</strong></p>
                        <p>{userReview.comment}</p>
                        <p><BsStarFill /> {userReview.rating}</p>
                    </div>
                ) : (
                    <div className='user-review'>
                        <p>No has opinado sobre esta carrera. <a href={`/race/${race.raceId}`}>Deja tu opinión aquí</a></p>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}

export default RaceCard