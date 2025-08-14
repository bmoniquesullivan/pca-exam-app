import React from 'react';
import '../styles/HomePage.css'; // Make sure this path is correct

function HomePage({ onStart }) {
  // Replace with your actual public image URL from Google Cloud Storage
  const imageUrl = "https://storage.googleapis.com/pub_files_moni/images/startpage.png";

  return (
    <div className="home-container">
      {/* Image element */}
      <img
        src={imageUrl}
        alt="Professional Cloud Architect Exam Practice"
        className="home-page-image" // Add a new class for image styling
      />

      {/* Start button */}
      <button className="start-button" onClick={onStart}>
        START
      </button>
    </div>
  );
}

export default HomePage;