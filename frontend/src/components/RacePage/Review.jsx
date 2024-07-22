import React, { useEffect, useState } from 'react';
import { BsStarFill, BsHeart, BsHeartFill } from "react-icons/bs";
import { useSelector, useDispatch } from 'react-redux';
import { createLike, deleteLike, readLikes } from '../../redux/reducers/likesReducer';
import { readUsers } from '../../redux/reducers/usersReducer';

function Review({ review }) {
    const users = useSelector((state) => state.users.data);
    const likes = useSelector((state) => state.likes.data);
    const currentUserID = useSelector((state) => state.auth.id);
    const dispatch = useDispatch();
    
    const [isLiked, setIsLiked] = useState(false);
    const [cantLikes, setCantLikes] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [likesList, setLikesList] = useState([]);

    useEffect(() => {
        dispatch(readUsers());
        dispatch(readLikes());
    }, [dispatch]);

    useEffect(() => {
        const userLike = likes.find(like => like.reviewId === review.id && like.userId === currentUserID);
        setIsLiked(!!userLike);
    }, [likes, review.id, currentUserID]);

    useEffect(() => {
        const cant = likes.filter(like => like.reviewId === review.id).length;
        setCantLikes(cant);
    }, [likes, review.id])

    const handleLikeToggle = () => {
        if (isLiked) {
            const like = likes.find(like => like.reviewId === review.id && like.userId === currentUserID);
            dispatch(deleteLike(like.id)).then(() => {
                dispatch(readLikes());
            });
        } else {
            dispatch(createLike({ reviewId: review.id, userId: currentUserID })).then(() => {
                dispatch(readLikes());
            });
        }
    };

    const user = users.find(user => user.id === review.userId);

    return (
        <div className='review'>
            <div className="review-top">
                <div className='user-opinion'>
                    <p className="username"><strong>{user ? user.username : 'Unknown User'}</strong></p>
                    <div className="rating">
                        <BsStarFill color="gold" /> {review.rating}
                    </div>
                </div>
                <div onClick={handleLikeToggle} className="like-button">
                    {isLiked ? <BsHeartFill color="red" /> : <BsHeart />}
                    <p>{cantLikes}</p>
                </div>
            </div>
            <div className="review-content">
                <p>{review.comment}</p>
            </div>
        </div>
    );
}

export default Review;