import React from 'react';
import { BsStarFill } from "react-icons/bs";

function Review({ review }) {
    return (
        <div className='review'>
            <p><strong>{review.user}</strong></p>
            <p>{review.comment}</p>
            <p><BsStarFill /> {review.rating}</p>
        </div>
    );
}

export default Review;