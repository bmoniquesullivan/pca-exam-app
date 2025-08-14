import React, { useState, useEffect } from 'react';
import '../styles/QuestionPage.css';

function QuestionPage({ question, onSubmitAnswer, showFeedback, isCorrect }) {
  // --- MODIFICATION START ---
  // Now, selectedAnswer will be an array of the IDs of the selected options
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  // --- MODIFICATION END ---

  const handleOptionClick = (optionId) => {
    // --- MODIFICATION START ---
    if (selectedAnswers.includes(optionId)) {
      // If already selected, remove it (toggle off)
      setSelectedAnswers(selectedAnswers.filter(id => id !== optionId));
    } else {
      // If not selected, add it
      setSelectedAnswers([...selectedAnswers, optionId]);
    }
    // --- MODIFICATION END ---
  };

  const handleConfirm = () => {
    // --- MODIFICATION START ---
    if (selectedAnswers.length > 0) {
      // Pass the array of selected answers
      onSubmitAnswer(selectedAnswers);
    }
    // --- MODIFICATION END ---
  };

  // Reset selected answers when a new question is loaded
  useEffect(() => {
    setSelectedAnswers([]); // Reset to an empty array
  }, [question]);

  if (!question) {
    return <div>Loading question...</div>;
  }
const googleIconUrl = "https://storage.googleapis.com/pub_files_moni/images/gcplogosmall.png"
  return (
    <div className="question-container">
      <div className="question-header">
        <img
          src={googleIconUrl} 
          alt="Google icon" 
          className="google-icon" 
        />
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
              // --- MODIFICATION START ---
              // Add 'selected' class if the option's ID is in our selectedAnswers array
              className={`option-item ${selectedAnswers.includes(option.id) ? 'selected' : ''}`}
              onClick={() => handleOptionClick(option.id)}
              // --- MODIFICATION END ---
            >
              <span className="option-id">{option.id}</span>
              <span className="option-text">{option.text}</span>
            </div>
          ))}
        </div>

        <div className="action-buttons">
          <button className="confirm-button" onClick={handleConfirm} disabled={selectedAnswers.length === 0}> {/* Disabled if nothing selected */}
            Confirm
          </button>
          <button className="clear-button" onClick={() => setSelectedAnswers([])}> {/* Clear all selections */}
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