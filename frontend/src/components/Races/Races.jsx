import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { readRaces, editRace, deleteRace, resetRace } from '../../redux/reducers/racesReducer.js';
import RaceForm from './RaceForm.jsx';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Races = () => {
    const races = useSelector((state) => state.races.data);
    const dispatch = useDispatch();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        dispatch(readRaces());
    }, [dispatch]);

    const handleShowCreateModal = () => {
        setEditingId(null);
        dispatch(resetRace());
        setShowCreateModal(true);
    };

    const handleShowEditModal = (id) => {
        setEditingId(id);
        dispatch(editRace({ raceId: id }));
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setEditingId(null);
        dispatch(resetRace());
        setShowCreateModal(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta carrera?')) {
            dispatch(deleteRace(id)).then(() => dispatch(readRaces()));
        }
    };

    return (
        <div>
            <h2>Listado de Carreras</h2>
            <Button class="btn btn-outline-success" onClick={handleShowCreateModal}>
                CREAR CARRERA
            </Button>
            <div className="table-responsive">
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Nombre de la carrera</th>
                            <th scope="col">Circuito</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Horario</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {races && races.map((race) => (
                            <tr key={race.raceId}>
                                <th scope="row">{race.raceId}</th>
                                <td>{race.raceName}</td>
                                <td>{race.circuit}</td>
                                <td>{race.date}</td>
                                <td>{race.time}</td>
                                <td>
                                    <button type="button" class="btn btn-warning mx-1" onClick={() => handleShowEditModal(race.raceId)}>Editar</button>
                                    <button type="button" className="btn btn-danger mx-1" onClick={() => handleDelete(race.raceId)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingId ? 'Editar carrera' : 'Crear nueva carrera'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RaceForm raceId={editingId} handleCloseModal={handleCloseCreateModal} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Races;