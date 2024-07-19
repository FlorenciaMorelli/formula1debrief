import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { readRace, readReviews } from '../../redux/reducers/racesReducer';
import Review from '../components/RacePage/Review';

function RacePage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const race = useSelector((state) => state.races.data.find(race => race.id === parseInt(id)));
    const reviews = useSelector((state) => state.reviews.data.filter(review => review.raceId === parseInt(id)));

    useEffect(() => {
        dispatch(readRace(id));
        dispatch(readReviews());
    }, [dispatch, id]);

    return (
        <div className='racePage'>
            {race && (
                <>
                    <h1>{race.raceName}</h1>
                    <p>{race.date} {race.time}</p>
                    <p>{race.circuit}</p>
                    <h2>Opiniones de los usuarios</h2>
                    <div className='reviews'>
                        {reviews.map(review => (
                            <Review key={review.id} review={review} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default RacePage;