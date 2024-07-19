import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { readReviews } from '../../redux/reducers/reviewsReducer';
import Card from 'react-bootstrap/Card';
import { BsStarFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function RaceCard(props) {
    const race = props.race;
    const reviews = useSelector((state) => state.reviews.data);
    const currentUserID = useSelector((state) => state.auth.id);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(readReviews());
    }, [dispatch]);

    const userReview = reviews.find(review => review.raceId === race.raceId && review.userId && currentUserID);

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric"}
        return new Date(dateString).toLocaleDateString("es-ES", options)
    }

    return (
        <Card className='raceCard' onClick={() => {
            navigate(`/race/${race.raceId}`)
        }}>
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
                <div className="card-info">
                    <Card.Title>{race.raceName}</Card.Title>
                    <Card.Text className='date'>
                        {formatDate(race.date).toString()}
                    </Card.Text>
                </div>
                <div className="card-opinion">
                    {userReview ? (
                        <div className='user-review'>
                            <div className="reviewoncard-top">
                                <p><strong>Opinaste:</strong></p>
                                <p><BsStarFill /> {userReview.rating}</p>
                            </div>
                            <p className='review-text'>"{userReview.comment}"</p>
                        </div>
                    ) : (
                        <div className='user-review'>
                            <p>Aún no opinaste sobre esta carrera.</p>
                            <Button className='btn-goreview'> Dar mi opinión</Button>
                        </div>
                    )}
                </div>
            </Card.Body>
        </Card>

        
    );
}

export default RaceCard