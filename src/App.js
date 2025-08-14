import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import QuestionPage from './components/QuestionPage';
import ResultPage from './components/ResultPage';
import rawQuestionsData from './data/questions.json';
import './styles/global.css';

const QUESTIONS_PER_EXAM = 5;

function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  const questions = rawQuestionsData;
  const totalQuestions = QUESTIONS_PER_EXAM;

  const handleStartExam = () => {
    const allQuestionsShuffled = shuffleArray([...questions]);
    const examQuestions = allQuestionsShuffled.slice(0, QUESTIONS_PER_EXAM);
    setShuffledQuestions(examQuestions);
    
    setCurrentPage('question');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowFeedback(false);
  };

  const handleSubmitAnswer = (selectedAnswerIds) => {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const correctAnswerString = currentQuestion.correctAnswer;
    
    const sortedSelectedAnswers = [...selectedAnswerIds].sort().join('');
    const sortedCorrectAnswer = [...correctAnswerString.split('')].sort().join('');
    
    const correct = sortedSelectedAnswers === sortedCorrectAnswer;

    setIsAnswerCorrect(correct);
    setShowFeedback(true);

    setUserAnswers(prev => [
      ...prev,
      {
        question: currentQuestion,
        userAnswerIds: selectedAnswerIds,
        isCorrect: correct
      }
    ]);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setCurrentPage('result');
    }
  };

  const handleRestartExam = () => {
    setCurrentPage('home');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowFeedback(false);
  };

  useEffect(() => {
    if (currentPage === 'question' && showFeedback) {
      const timer = setTimeout(() => {
        handleNextQuestion();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showFeedback, currentPage, currentQuestionIndex, totalQuestions]);

  let componentToRender;
  switch (currentPage) {
    case 'home':
      componentToRender = <HomePage onStart={handleStartExam} />;
      break;
    case 'question':
      if (currentQuestionIndex >= shuffledQuestions.length && shuffledQuestions.length > 0) {
          setCurrentPage('result');
          componentToRender = <div>Loading results...</div>;
      } else if (shuffledQuestions.length > 0) {
          componentToRender = (
              <QuestionPage
                  question={shuffledQuestions[currentQuestionIndex]}
                  onSubmitAnswer={handleSubmitAnswer}
                  showFeedback={showFeedback}
                  isCorrect={isAnswerCorrect}
              />
          );
      } else {
          componentToRender = <div>Preparing your exam...</div>;
      }
      break;
    case 'result':
      const score = userAnswers.filter(ans => ans.isCorrect).length;
      componentToRender = (
        <ResultPage
          score={score}
          totalQuestions={totalQuestions}
          onRestart={handleRestartExam}
          results={userAnswers}
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