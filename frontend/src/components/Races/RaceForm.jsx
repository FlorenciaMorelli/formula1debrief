import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { createRace, updateRace, readOneRace, readRaces } from '../../redux/reducers/racesReducer';

const raceSchema = Yup.object().shape({
    raceName: Yup.string().required('Nombre de la carrera es requerido'),
    circuit: Yup.string().required('Circuito es requerido'),
    date: Yup.string().required('Fecha es requerida'),
    time: Yup.string().required('Horario es requerido'),
});

const RaceForm = ({ raceId, handleCloseModal }) => {
    const dispatch = useDispatch();
    const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        resolver: yupResolver(raceSchema)
    });

    const editingObj = useSelector((state) => state.races.editingObj);

    useEffect(() => {
        if (raceId) {
            dispatch(readOneRace(raceId));
        } else {
            reset(); // Restablecer el formulario al crear una nueva carrera
        }
    }, [dispatch, raceId, reset]);

    useEffect(() => {
        if (editingObj) {
            setValue('raceName', editingObj.raceName);
            setValue('circuit', editingObj.circuit);
            setValue('date', editingObj.date);
            setValue('time', editingObj.time);
        }
    }, [editingObj, setValue]);

    const onSubmit = (data) => {
        if (raceId) {
            dispatch(updateRace({ ...data, raceId })).then(() => {
                handleCloseModal();
                dispatch(readRaces());
            });
        } else {
            dispatch(createRace(data)).then(() => {
                handleCloseModal();
                dispatch(readRaces());
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <label>Nombre de la carrera</label>
                <Controller
                    control={control}
                    name="raceName"
                    render={({ field }) => <input type="text" className={`form-control ${errors.raceName ? 'is-invalid' : ''}`} {...field} />}
                />
                <div className="invalid-feedback">{errors.raceName?.message}</div>
            </div>
            <div className="form-group">
                <label>Circuito</label>
                <Controller
                    control={control}
                    name="circuit"
                    render={({ field }) => <input type="text" className={`form-control ${errors.circuit ? 'is-invalid' : ''}`} {...field} />}
                />
                <div className="invalid-feedback">{errors.circuit?.message}</div>
            </div>
            <div className="form-group">
                <label>Fecha</label>
                <Controller
                    control={control}
                    name="date"
                    render={({ field }) => <input type="date" className={`form-control ${errors.date ? 'is-invalid' : ''}`} {...field} />}
                />
                <div className="invalid-feedback">{errors.date?.message}</div>
            </div>
            <div className="form-group">
                <label>Horario</label>
                <Controller
                    control={control}
                    name="time"
                    render={({ field }) => <input type="time" className={`form-control ${errors.time ? 'is-invalid' : ''}`} {...field} />}
                />
                <div className="invalid-feedback">{errors.time?.message}</div>
            </div>
            <br />
            <button type="submit" class="btn btn-success">Guardar</button>
        </form>
    );
};

export default RaceForm;