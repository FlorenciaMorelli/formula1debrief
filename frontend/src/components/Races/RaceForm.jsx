import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addRace } from '../../redux/reducers/racesReducer';

const RaceForm = () => {
    const dispatch = useDispatch();
    const [raceName, setRaceName] = useState('');
    const [circuit, setCircuit] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addRace({ raceName, circuit, date, time }));
        // Clear form after submission
        setRaceName('');
        setCircuit('');
        setDate('');
        setTime('');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="raceName" className="form-label">Nombre de la carrera</label>
                    <input
                        type="text"
                        className="form-control"
                        id="raceName"
                        value={raceName}
                        onChange={(e) => setRaceName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="circuit" className="form-label">Circuito</label>
                    <input
                        type="text"
                        className="form-control"
                        id="circuit"
                        value={circuit}
                        onChange={(e) => setCircuit(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="date" className="form-label">Fecha</label>
                    <input
                        type="date"
                        className="form-control"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="time" className="form-label">Horario</label>
                    <input
                        type="time"
                        className="form-control"
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Race</button>
            </form>
        </div>
    );
};

export default RaceForm;
