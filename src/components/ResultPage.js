import React from 'react';
import '../styles/ResultPage.css'; // We'll create this CSS file soon

function ResultPage({ score, totalQuestions, onRestart }) {
  const percentage = ((score / totalQuestions) * 100).toFixed(2);

  return (
    <div className="result-container">
      <div className="result-card">
        <h2>Exam Results</h2>
        <p>You have completed the exam!</p>
        <p>Your score: {score} out of {totalQuestions}</p>
        <p>Percentage: {percentage}%</p>
        <button className="restart-button" onClick={onRestart}>
          Try Again
        </button>
      </div>
    </div>
  );
}

export default ResultPage;