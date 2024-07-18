import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { createComment, updateComment, readOneComment, readComments } from '../../redux/reducers/commentsReducer';

const commentSchema = Yup.object().shape({
    reviewId: Yup.number().required('La reseña es requerida'),
    userId: Yup.number().required('El usuario es requerido'),
    comment: Yup.string().required('El comentario es requerido'),
});

const ReviewForm = ({ id, handleCloseModal }) => {
    const dispatch = useDispatch();

    const reviews = useSelector((state) => state.reviews.data);
    const users = useSelector((state) => state.users.data);

    const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        resolver: yupResolver(commentSchema)
    });

    const editingObj = useSelector((state) => state.comments.editingObj);

    useEffect(() => {
        if (id) {
            dispatch(readOneComment(id));
        } else {
            reset();
        }
    }, [dispatch, id, reset]);

    useEffect(() => {
        if (editingObj) {
            setValue('reviewId', editingObj.reviewId);
            setValue('userId', editingObj.userId);
            setValue('comment', editingObj.comment);
        }
    }, [editingObj, setValue]);

    const onSubmit = (data) => {
        if (id) {
            dispatch(updateComment({ ...data, id })).then(() => {
                handleCloseModal();
                dispatch(readComments());
            });
        } else {
            dispatch(createComment(data)).then(() => {
                handleCloseModal();
                dispatch(readComments());
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
            <div className="form-group">
                <label>Comentario</label>
                <Controller
                    control={control}
                    name="comment"
                    render={({ field }) => <input type="text" className={`form-control ${errors.comment ? 'is-invalid' : ''}`} {...field} />}
                />
                <div className="invalid-feedback">{errors.comment?.message}</div>
            </div>
            <br />
            <button type="submit" class="btn btn-success">Guardar</button>
        </form>
    );
};

export default ReviewForm;