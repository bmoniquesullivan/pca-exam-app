import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import QuestionPage from './components/QuestionPage';
import ResultPage from './components/ResultPage';
import rawQuestionsData from './data/questions.json';
import './styles/global.css';

// --- Fisher-Yates (Knuth) Shuffle Algorithm ---
function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}
// --- End of Shuffle Algorithm ---

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]); // State to hold shuffled questions

  const questions = rawQuestionsData.examQuestions;
  const totalQuestions = questions.length;

  // --- MODIFICATION START: Shuffle questions when the component mounts ---
  useEffect(() => {
      // Shuffle the questions once when the component mounts
      setShuffledQuestions(shuffleArray([...questions]));
  }, [questions]); // Dependency on 'questions' ensures it re-shuffles if questions were to change dynamically (not the case here, but good practice)
  // --- MODIFICATION END ---

  const handleStartExam = () => {
    // When starting a new exam, re-shuffle the questions
    setShuffledQuestions(shuffleArray([...questions]));
    setCurrentPage('question');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowFeedback(false);
  };

  const handleSubmitAnswer = (selectedAnswers) => {
    const currentQuestion = shuffledQuestions[currentQuestionIndex]; // Use the shuffled questions
    const correctAnswerString = currentQuestion.correctAnswer;

    const sortedSelectedAnswers = [...selectedAnswers].sort().join('');
    const sortedCorrectAnswer = [...correctAnswerString].sort().join('');

    const correct = sortedSelectedAnswers === sortedCorrectAnswer;

    setIsAnswerCorrect(correct);
    setShowFeedback(true);

    setUserAnswers(prev => [
      ...prev,
      {
        questionIndex: currentQuestionIndex, // Still refers to its index in the *shuffled* array
        userAnswer: selectedAnswers,
        correctAnswer: correctAnswerString,
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
    // --- MODIFICATION START: Re-shuffle when restarting ---
    setShuffledQuestions(shuffleArray([...questions]));
    // --- MODIFICATION END ---
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
  }, [showFeedback, currentPage, totalQuestions]);

  let componentToRender;
  switch (currentPage) {
    case 'home':
      componentToRender = <HomePage onStart={handleStartExam} />;
      break;
    case 'question':
      // Ensure we don't try to render a question if the index is out of bounds
      if (currentQuestionIndex >= shuffledQuestions.length) {
          setCurrentPage('result'); // Fallback to result page if something goes wrong
          componentToRender = <div>Error: Ran out of questions or invalid index.</div>;
      } else {
          componentToRender = (
              <QuestionPage
                  question={shuffledQuestions[currentQuestionIndex]} // Use shuffledQuestions
                  onSubmitAnswer={handleSubmitAnswer}
                  showFeedback={showFeedback}
                  isCorrect={isAnswerCorrect}
              />
          );
      }
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