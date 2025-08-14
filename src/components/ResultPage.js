import React from 'react';
import '../styles/ResultPage.css';

function ResultPage({ score, totalQuestions, onRestart, results }) {
  const percentage = totalQuestions > 0 ? ((score / totalQuestions) * 100).toFixed(2) : 0;
  const incorrectAnswers = results.filter(result => !result.isCorrect);

  const getAnswerText = (question, answerIds) => {
    const selectedOptions = question.options.filter(option =>
      answerIds.includes(option.id)
    );
    return selectedOptions.map(opt => `${opt.id} - ${opt.text}`).join('; ');
  };

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

      {incorrectAnswers.length > 0 && (
        <div className="review-section">
          <h3>Review Your Incorrect Answers</h3>
          {incorrectAnswers.map((result, index) => (
            <div key={index} className="review-item">
              <p className="review-question-text">
                <strong>Question:</strong> {result.question.questionText}
              </p>
              <p className="your-answer">
                <strong>Your Answer:</strong>
                <span className="answer-text incorrect-text">
                  {getAnswerText(result.question, result.userAnswerIds)}
                </span>
              </p>
              <p className="correct-answer">
                <strong>Correct Answer:</strong>
                <span className="answer-text correct-text">
                  {getAnswerText(result.question, result.question.correctAnswer.split(''))}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResultPage;