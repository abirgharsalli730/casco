import React from 'react';
import '../styles/Card.css';

const Card = ({ title, image, content, onViewListClick, onViewResultsClick }) => {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <img src={image} alt={title} className="card-image" />
      <p className="card-content">{content}</p>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button className="view-more" onClick={onViewListClick}>
          View List
        </button>
        <button className="view-more" onClick={onViewResultsClick} style={{ marginLeft: '15px' }}>
          View Results
        </button>
      </div>
    </div>
  );
};

export default Card;
