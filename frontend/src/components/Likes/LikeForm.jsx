import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { createLike, updateLike, readOneLike, readLikes } from '../../redux/reducers/likesReducer';

const likeSchema = Yup.object().shape({
    reviewId: Yup.number().required('La reseña es requerida'),
    userId: Yup.number().required('El usuario es requerido')
});

const ReviewForm = ({ id, handleCloseModal }) => {
    const dispatch = useDispatch();

    const reviews = useSelector((state) => state.reviews.data);
    const users = useSelector((state) => state.users.data);

    const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        resolver: yupResolver(likeSchema)
    });

    const editingObj = useSelector((state) => state.likes.editingObj);

    useEffect(() => {
        if (id) {
            dispatch(readOneLike(id));
        } else {
            reset();
        }
    }, [dispatch, id, reset]);

    useEffect(() => {
        if (editingObj) {
            setValue('reviewId', editingObj.reviewId);
            setValue('userId', editingObj.userId);
        }
    }, [editingObj, setValue]);

    const onSubmit = (data) => {
        if (id) {
            dispatch(updateLike({ ...data, id })).then(() => {
                handleCloseModal();
                dispatch(readLikes());
            });
        } else {
            dispatch(createLike(data)).then(() => {
                handleCloseModal();
                dispatch(readLikes());
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <label>Reseña</label>
                <Controller
                    control={control}
                    name="reviewId"
                    render={({ field }) => <select className={`form-select form-control ${errors.reviewId ? 'is-invalid' : ''}`} {...field}>
                        <option value="">Seleccione una reseña</option>
                        {
                            reviews && reviews.map((review) => {
                                return(
                                    <option value={ review.id }>{ review.comment }</option>
                                )
                            })
                        }
                    </select>}
                />
                <div className="invalid-feedback">{errors.reviewId?.message}</div>
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
            <br />
            <button type="submit" class="btn btn-success">Guardar</button>
        </form>
    );
};

export default ReviewForm;