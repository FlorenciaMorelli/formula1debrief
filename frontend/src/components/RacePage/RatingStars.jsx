import React, { useState } from 'react';
import { BsStarFill, BsStar } from 'react-icons/bs';

const RatingStars = ({ rating, onRatingChange, readOnly = false }) => {
    const [hasClicked, setHasClicked] = useState(false);

    const handleMouseEnter = (index) => {
        if (!readOnly && !hasClicked) {
            onRatingChange(index);
        }
    };

    const handleClick = (index) => {
        if (!readOnly) {
            onRatingChange(index);
            setHasClicked(true);
        }
    };

    return (
        <div className='rating-stars'>
            {[1, 2, 3, 4, 5].map((index) => (
                <span
                    key={index}
                    onClick={() => handleClick(index)}
                    onMouseEnter={() => handleMouseEnter(index)}
                >
                    {index <= rating ? <BsStarFill /> : <BsStar />}
                </span>
            ))}
        </div>
    );
};

export default RatingStars;