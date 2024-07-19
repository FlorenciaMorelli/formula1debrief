import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { readOneRace } from '../redux/reducers/racesReducer';
import { readReviews } from '../redux/reducers/reviewsReducer';
import Review from '../components/RacePage/Review';
import { BsChevronLeft } from 'react-icons/bs';

function RacePage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const race = useSelector((state) => state.races.data.find(race => race.raceId === parseInt(id)));
    const reviews = useSelector((state) => state.reviews.data.filter(review => review.raceId === parseInt(id)));

    useEffect(() => {
        dispatch(readOneRace(id));
        dispatch(readReviews());
    }, [dispatch, id]);

    console.log('Race: ', race);
    console.log('Reviews: ', reviews);


    return (
        <div className='racePage'>
            <Link className='link-back' to='/home'>
                <BsChevronLeft />
                Volver
            </Link>

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