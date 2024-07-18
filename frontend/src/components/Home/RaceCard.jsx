import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { readReviews } from '../../redux/reducers/reviewsReducer';
import Card from 'react-bootstrap/Card';


function RaceCard(props) {

    const race = props.race;
    const latestReview = useSelector((state) => state.reviews.data);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(readReviews());
    }, [dispatch]);

    return (
        <Card className='raceCard'>
            <Card.Body>
                <Card.Subtitle className="mb-2 text-muted">{ race.circuit }</Card.Subtitle>
                <Card.Title>{ race.raceName }</Card.Title>
                <Card.Text>
                    { race.date } { race.time }
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default RaceCard