import React, { useState } from "react";

const StarRating = ({ totalStars = 5, onRatingChange }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleClick = (star) => {
    setRating(star);
    onRatingChange(star); // send selected rating to parent
  };

  return (
    <div style={{ display: "flex", gap: "5px", cursor: "pointer" }}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={starValue}
            style={{
              color: starValue <= (hover || rating) ? "#ffc107" : "#e4e5e9",
              fontSize: "2rem",
            }}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
