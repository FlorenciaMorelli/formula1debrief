import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { listRaces } from '../redux/reducers/racesReducer';
import RaceForm from './RaceForm.jsx';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const Races = () => {
    const races = useSelector((state) => state.races.data);
    const dispatch = useDispatch();
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        dispatch(listRaces());
    }, [dispatch]);

    const handleShowCreateModal = () => setShowCreateModal(true);
    const handleCloseCreateModal = () => setShowCreateModal(false);

    return (
        <div>
            <h1>Listado de Carreras</h1>
            <Button variant="primary" onClick={handleShowCreateModal}>
                Crear Nuevo
            </Button>
            <div className="table-responsive">
                <table class="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Circuito</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Horario</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        {races && races.map((race) => (
                            <tr key={race.raceId}>
                                <th scope="row">{race.raceId}</th>
                                <td>{race.raceName}</td>
                                <td>{race.circuit}</td>
                                <td>{race.date}</td>
                                <td>{race.time}</td>
                                <td>
                                    <button type="button" className="btn btn-primary mx-1">Editar</button>
                                    <button type="button" className="btn btn-danger mx-1">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para crear nueva carrera */}
            <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Nueva Carrera</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RaceForm handleCloseModal={handleCloseCreateModal} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Races;
