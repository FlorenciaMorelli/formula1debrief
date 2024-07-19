import React from 'react';
import { BsStarFill, BsStar } from 'react-icons/bs';

const RatingStars = ({ rating, onRatingChange }) => {
    const handleMouseEnter = (index) => {
        onRatingChange(index);
    };

    return (
        <div className='rating-stars'>
            {[1, 2, 3, 4, 5].map((index) => (
                <span
                    key={index}
                    onClick={() => onRatingChange(index)}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => onRatingChange(rating)}
                >
                    {index <= rating ? <BsStarFill /> : <BsStar />}
                </span>
            ))}
        </div>
    );
};

export default RatingStars;