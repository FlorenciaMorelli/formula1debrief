import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { readRaces } from '../../redux/reducers/racesReducer';
import RaceCard from './RaceCard';

function LatestRaces() {
    const dispatch = useDispatch();
    const races = useSelector((state) => state.races.data);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRaces, setFilteredRaces] = useState([]);

    useEffect(() => {
        dispatch(readRaces());
    }, [dispatch]);

    useEffect(() => {
        setFilteredRaces(
            races
                .slice()
                .reverse()
                .filter(race =>
                    race.raceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    race.circuit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    race.date.toLowerCase().includes(searchTerm.toLowerCase())
                )
        );
    }, [searchTerm, races]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div>
            <input
                type="text"
                className='searchRaces'
                placeholder="Busca carreras..."
                value={searchTerm}
                onChange={handleSearch}
            />
            <ul>
                {filteredRaces.map(race => (
                    <RaceCard key={race.id} race={race} />
                ))}
            </ul>
        </div>
    );
}

export default LatestRaces;