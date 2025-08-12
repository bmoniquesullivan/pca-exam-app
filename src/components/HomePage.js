import React from 'react';
import '../styles/HomePage.css'; // We'll create this CSS file soon

function HomePage({ onStart }) {
  return (
    <div className="home-container">
      <div className="intro-text">
        <p>Welcome to the Professional Cloud Architect Exam Practice!</p>
        <p>This app provides practice questions to help you prepare for your PCA certification.</p>
      </div>
      <button className="start-button" onClick={onStart}>
        START
      </button>
    </div>
  );
}

export default HomePage;