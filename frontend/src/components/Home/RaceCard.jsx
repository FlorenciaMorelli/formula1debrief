import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { readReviews } from '../../redux/reducers/reviewsReducer';
import Card from 'react-bootstrap/Card';
import { BsStarFill } from "react-icons/bs";



function RaceCard(props) {

    const race = props.race;
    const reviews = useSelector((state) => state.reviews.data);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(readReviews());
    }, [dispatch]);

    console.log(reviews);

    return (
        <Card className='raceCard'>
            <Card.Header>
                <Card.Text className='circuit'>
                {race.circuit}
                </Card.Text>
                <Card.Text className='rating'>
                    <BsStarFill /> 
                    {
                        reviews && reviews.map((review) => {
                            if (race.raceId === review.raceId) {
                                return <> { review.rating }</>
                            }
                        })
                    }
                </Card.Text>
            </Card.Header>
            <Card.Body>
                <Card.Title>{race.raceName}</Card.Title>
                <Card.Text className='date'>
                    {race.date} {race.time}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default RaceCard