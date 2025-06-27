import React from 'react';
import './MainContent.css';

const MainContent = ({ children }) => {
  return (
    <div className="details">
      {children}
    </div>
  );
};

export default MainContent;