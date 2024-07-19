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
                    formatDate(race.date).toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
        );
    }, [searchTerm, races]);

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric"}
        return new Date(dateString).toLocaleDateString("es-ES", options)
    }

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
                    <RaceCard key={race.raceId} race={race} />
                ))}
            </ul>
        </div>
    );
}

export default LatestRaces;