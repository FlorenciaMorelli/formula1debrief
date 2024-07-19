import React, { useEffect } from 'react';
import { BsStarFill } from "react-icons/bs";
import { readUsers } from '../../redux/reducers/usersReducer';
import { useSelector, useDispatch } from 'react-redux';

function Review({ review }) {
    const users = useSelector((state) => state.users.data);
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(readUsers());
    }, [dispatch]);

    const user = users.find(user => user.id === review.userId);

    return (
        <div className='review'>
            <div className="review-top">
                <p><strong>{user ? user.username : 'Unknown User'}</strong></p>
                <p><BsStarFill /> {review.rating}</p>
            </div>
            <div className="review-text">
                <p>{review.comment}</p>
            </div>
        </div>
    );
}

export default Review;