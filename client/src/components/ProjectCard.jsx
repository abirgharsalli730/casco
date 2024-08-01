import React from 'react';
import '../styles/ProjectCard.css';

const ProjectCard = ({ title, content, createdAt }) => {
  return (
    <div className="card">
      <div className="card-title-container">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-content-container">
        <p className="card-content">{content}</p>
        <p className="card-date">Created At: {new Date(createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default ProjectCard;



