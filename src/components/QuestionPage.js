import React, { useState, useEffect } from 'react';
import '../styles/QuestionPage.css'; // We'll create this CSS file soon

function QuestionPage({ question, onSubmitAnswer, showFeedback, isCorrect }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleOptionClick = (optionId) => {
    setSelectedAnswer(optionId);
  };

  const handleConfirm = () => {
    if (selectedAnswer !== null) {
      onSubmitAnswer(selectedAnswer);
    }
  };

  // Reset selected answer when a new question is loaded
  useEffect(() => {
    setSelectedAnswer(null);
  }, [question]);

  if (!question) {
    return <div>Loading question...</div>;
  }

  return (
    <div className="question-container">
      <div className="question-header">
        <span className="google-icon">G</span>
        <h2 className="exam-title">Professional Cloud Architect Exam Practice</h2>
      </div>

      <div className="question-card">
        <div className="question-number">
          <p>Question: {question.questionNumber}</p>
        </div>
        <p className="question-text">{question.questionText}</p>

        <div className="answer-options">
          <h4>Answer Options:</h4>
          {question.options.map((option) => (
            <div
              key={option.id}
              className={`option-item ${selectedAnswer === option.id ? 'selected' : ''}`}
              onClick={() => handleOptionClick(option.id)}
            >
              <span className="option-id">{option.id}</span>
              <span className="option-text">{option.text}</span>
            </div>
          ))}
        </div>

        <div className="action-buttons">
          <button className="confirm-button" onClick={handleConfirm} disabled={selectedAnswer === null}>
            Confirm
          </button>
          <button className="clear-button" onClick={() => setSelectedAnswer(null)}>
            Clear
          </button>
        </div>

        {showFeedback && (
          <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect.'}
          </div>
        )}
      </div>

      <button className="check-documentation-button" onClick={() => console.log('Check Documentation clicked')}>
        Check Documentation
      </button>
    </div>
  );
}

export default QuestionPage;