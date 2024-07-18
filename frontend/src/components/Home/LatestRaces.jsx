import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { readRaces } from '../../redux/reducers/racesReducer';
import RaceCard from './RaceCard';

function LatestRaces() {
    const races = useSelector((state) => state.races.data);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);


    useEffect(() => {
        dispatch(readRaces());
    }, [dispatch]);

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        const results = races.filter((race) =>
            race.raceName.toLowerCase().includes(value.toLowerCase())
        );
        setSearchResults(results);
    };


    return (
        <div>
            {
                races.map((race) => {
                    return (
                        <>
                            <RaceCard race={race} />
                            <br />
                        </>
                    );
                })
            }
        </div>
    )
}

export default LatestRaces