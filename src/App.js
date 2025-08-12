import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import QuestionPage from './components/QuestionPage';
import ResultPage from './components/ResultPage';
//import questionsData from './data/questions.json'; // Import your JSON data
import rawQuestionsData from './data/questions.json';
import './styles/global.css'; // Import global styles

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'question', 'result'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]); // Stores { questionIndex, userAnswer, isCorrect }
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  const totalQuestions = 5; // As per your requirement

  // Shuffle questions at the start if you want random order
  // For now, we'll use them in the order they appear in the JSON
  //const shuffledQuestions = [...questionsData];
  const shuffledQuestions = [...rawQuestionsData.examQuestions];


  const handleStartExam = () => {
    setCurrentPage('question');
    setCurrentQuestionIndex(0); // Reset to the first question
    setUserAnswers([]); // Clear previous answers
    setShowFeedback(false); // Hide feedback on new exam start
  };

  const handleSubmitAnswer = (selectedAnswer) => {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correctAnswer;
    const correct = selectedAnswer === correctAnswer;

    setIsAnswerCorrect(correct);
    setShowFeedback(true);

    setUserAnswers(prev => [
      ...prev,
      {
        questionIndex: currentQuestionIndex,
        userAnswer: selectedAnswer,
        correctAnswer: correctAnswer,
        isCorrect: correct
      }
    ]);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false); // Hide feedback before moving to the next question
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setCurrentPage('result'); // Move to result page if it's the last question
    }
  };

  const handleRestartExam = () => {
    setCurrentPage('home');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowFeedback(false);
  };

  // Effect to automatically advance to the next question after feedback is shown
  useEffect(() => {
    if (currentPage === 'question' && showFeedback) {
      const timer = setTimeout(() => {
        handleNextQuestion();
      }, 2000); // Show feedback for 2 seconds
      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [showFeedback, currentPage]); // Depend on showFeedback and currentPage

  let componentToRender;
  switch (currentPage) {
    case 'home':
      componentToRender = <HomePage onStart={handleStartExam} />;
      break;
    case 'question':
      componentToRender = (
        <QuestionPage
          question={shuffledQuestions[currentQuestionIndex]}
          onSubmitAnswer={handleSubmitAnswer}
          showFeedback={showFeedback}
          isCorrect={isAnswerCorrect}
        />
      );
      break;
    case 'result':
      const score = userAnswers.filter(ans => ans.isCorrect).length;
      componentToRender = (
        <ResultPage
          score={score}
          totalQuestions={totalQuestions}
          onRestart={handleRestartExam}
        />
      );
      break;
    default:
      componentToRender = <HomePage onStart={handleStartExam} />;
  }

  return (
    <div className="App">
      {componentToRender}
    </div>
  );
}

export default App;