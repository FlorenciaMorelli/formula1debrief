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
    const reviews = useSelector((state) => state.reviews.data);

    useEffect(() => {
        dispatch(readOneRace(id));
        dispatch(readReviews());
    }, [dispatch, id]);

    const filteredReviews = reviews.filter(review => review.raceId === parseInt(id));

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
                    <div className='reviews'>
                        <h2>Opiniones de los usuarios</h2>
                        {filteredReviews.length > 0 ? (
                            filteredReviews.map(review => (
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