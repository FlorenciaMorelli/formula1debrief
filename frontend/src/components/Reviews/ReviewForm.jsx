import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { createReview, updateReview, readOneReview, readReviews } from '../../redux/reducers/reviewsReducer';

const reviewSchema = Yup.object().shape({
    raceId: Yup.number().required('La carrera es requerida'),
    userId: Yup.number().required('El usuario es requerido'),
    rating: Yup.number().min(1).max(5).required('La puntuación es requerida'),
    comment: Yup.string().required('El comentario es requerido'),
});

const ReviewForm = ({ id, handleCloseModal }) => {
    const dispatch = useDispatch();

    const races = useSelector((state) => state.races.data);
    const users = useSelector((state) => state.users.data);

    const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        resolver: yupResolver(reviewSchema)
    });

    const editingObj = useSelector((state) => state.reviews.editingObj);

    useEffect(() => {
        if (id) {
            dispatch(readOneReview(id));
        } else {
            reset(); // Restablecer el formulario al crear una nueva carrera
        }
    }, [dispatch, id, reset]);

    useEffect(() => {
        if (editingObj) {
            setValue('raceId', editingObj.raceId);
            setValue('userId', editingObj.userId);
            setValue('rating', editingObj.rating);
            setValue('comment', editingObj.comment);
        }
    }, [editingObj, setValue]);

    const onSubmit = (data) => {
        if (id) {
            dispatch(updateReview({ ...data, id })).then(() => {
                handleCloseModal();
                dispatch(readReviews());
            });
        } else {
            dispatch(createReview(data)).then(() => {
                handleCloseModal();
                dispatch(readReviews());
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <label>Carrera</label>
                <Controller
                    control={control}
                    name="raceId"
                    render={({ field }) => <select className={`form-select form-control ${errors.raceId ? 'is-invalid' : ''}`} {...field}>
                        <option value="">Seleccione una carrera</option>
                        {
                            races && races.map((race) => {
                                return(
                                    <option value={ race.raceId }>{ race.raceName }</option>
                                )
                            })
                        }
                    </select>}
                />
                <div className="invalid-feedback">{errors.raceId?.message}</div>
            </div>
            <div className="form-group">
                <label>Usuario</label>
                <Controller
                    control={control}
                    name="userId"
                    render={({ field }) => <select className={`form-select form-control ${errors.userId ? 'is-invalid' : ''}`} defaultValue={''} {...field}>
                        <option value="">Seleccione un usuario</option>
                    {
                        users && users.map((user) => {
                            return(
                                <option value={ user.id }>{ user.username }</option>
                            )
                        })
                    }
                </select>}
                />
                <div className="invalid-feedback">{errors.userId?.message}</div>
            </div>
            <div className="form-group">
                <label>Puntuación</label>
                <Controller
                    control={control}
                    name="rating"
                    render={({ field }) => <input type="number" min={1} max={5} className={`form-control ${errors.rating ? 'is-invalid' : ''}`} {...field} />}
                />
                <div className="invalid-feedback">{errors.rating?.message}</div>
            </div>
            <div className="form-group">
                <label>Comentario</label>
                <Controller
                    control={control}
                    name="comment"
                    render={({ field }) => <input type="text" className={`form-control ${errors.comment ? 'is-invalid' : ''}`} {...field} />}
                />
                <div className="invalid-feedback">{errors.comment?.message}</div>
            </div>
            <button type="submit" className="btn btn-primary">Guardar</button>
        </form>
    );
};

export default ReviewForm;