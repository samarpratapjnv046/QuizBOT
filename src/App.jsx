import './App.css';
import gptLOGO from './assets/chatgpt.svg';
import addBtn from './assets/add-30.png';
import home from './assets/home.svg';
import saved from './assets/bookmark.svg';
import rocket from './assets/rocket.svg';
import { generateQuiz, generateFeedback } from './openai';
import { useState } from 'react';

const topics = ['Wellness', 'Tech Trends', 'Science', 'History', 'Sports'];

function Question({ question, options, selected, onSelect }) {
  return (
    <div className="question">
      <h2>{question}</h2>
      <div className="options">
        {options.map((option, index) => (
          <button
            key={index}
            className={`option ${selected === index ? 'selected' : ''}`}
            onClick={() => onSelect(index)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState('topic');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [customQuizzes, setCustomQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({ topic: '', questions: [] });
  const [currentQuestion, setCurrentQuestion] = useState({ question: '', options: ['', '', '', ''], correct: 0 });

  const handleTopicSelect = async (topic) => {
    setErrorMessage('');
    setScreen('loading');
    const customQuiz = customQuizzes.find(q => q.topic === topic);
    if (customQuiz) {
      setQuestions(customQuiz.questions);
      setAnswers(new Array(customQuiz.questions.length).fill(null));
      setScreen('quiz');
    } else {
      try {
        const quiz = await generateQuiz(topic);
        setQuestions(quiz);
        setAnswers(new Array(quiz.length).fill(null));
        setScreen('quiz');
      } catch (error) {
        console.error('Error generating quiz:', error);
        setErrorMessage('Failed to generate quiz. Please try again.');
        setScreen('topic');
      }
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Finish quiz
      const correctAnswers = answers.reduce((acc, answer, index) => {
        return acc + (answer === questions[index].correct ? 1 : 0);
      }, 0);
      setScore(correctAnswers);
      setScreen('loading');
      generateFeedback(correctAnswers, questions.length).then(fb => {
        setFeedback(fb);
        setScreen('results');
      }).catch(error => {
        console.error('Error generating feedback:', error);
        setFeedback('Great job! Keep learning.');
        setScreen('results');
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const resetQuiz = () => {
    setScreen('topic');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScore(0);
    setFeedback('');
    setErrorMessage('');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewQuiz = () => {
    setScreen('create');
  };

  const handleSaveQuiz = () => {
    if (newQuiz.topic && newQuiz.questions.length > 0) {
      setCustomQuizzes([...customQuizzes, newQuiz]);
      setNewQuiz({ topic: '', questions: [] });
      setScreen('topic');
    }
  };

  const addQuestion = (question) => {
    setNewQuiz({ ...newQuiz, questions: [...newQuiz.questions, question] });
  };

  const allTopics = [...topics, ...customQuizzes.map(q => q.topic)];

  const renderTopicScreen = () => (
    <div className="topic-screen">
      <h1>Select a Topic</h1>
      <div className="topics">
        {allTopics.map(topic => (
          <button key={topic} className="topic-btn" onClick={() => handleTopicSelect(topic)}>
            {topic}
          </button>
        ))}
      </div>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );

  const renderLoadingScreen = () => (
    <div className="loading-screen">
      <h1>Loading...</h1>
      <div className="loader"></div>
    </div>
  );

  const renderQuizScreen = () => {
    const question = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    return (
      <div className="quiz-screen">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
        <Question
          question={question.question}
          options={question.options}
          selected={answers[currentQuestionIndex]}
          onSelect={handleAnswerSelect}
        />
        <div className="navigation">
          <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>Previous</button>
          <span>{currentQuestionIndex + 1} / {questions.length}</span>
          <button onClick={handleNext}>
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    );
  };

  const renderResultsScreen = () => (
    <div className="results-screen">
      <h1>Quiz Complete!</h1>
      <p>Your Score: {score} / {questions.length}</p>
      <p>{feedback}</p>
      <button className="midBtn" onClick={resetQuiz}>Take Another Quiz</button>
    </div>
  );

  const renderCreateScreen = () => {
    const handleAddQuestion = () => {
      if (currentQuestion.question && currentQuestion.options.every(o => o)) {
        addQuestion(currentQuestion);
        setCurrentQuestion({ question: '', options: ['', '', '', ''], correct: 0 });
      }
    };

    return (
      <div className="create-screen">
        <h1>Create New Quiz</h1>
        <input
          type="text"
          placeholder="Quiz Topic"
          value={newQuiz.topic}
          onChange={(e) => setNewQuiz({ ...newQuiz, topic: e.target.value })}
        />
        <h2>Add Question</h2>
        <input
          type="text"
          placeholder="Question"
          value={currentQuestion.question}
          onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
        />
        {currentQuestion.options.map((option, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => {
              const newOptions = [...currentQuestion.options];
              newOptions[index] = e.target.value;
              setCurrentQuestion({ ...currentQuestion, options: newOptions });
            }}
          />
        ))}
        <select
          value={currentQuestion.correct}
          onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct: parseInt(e.target.value) })}
        >
          <option value={0}>Correct: Option 1</option>
          <option value={1}>Correct: Option 2</option>
          <option value={2}>Correct: Option 3</option>
          <option value={3}>Correct: Option 4</option>
        </select>
        <button onClick={handleAddQuestion}>Add Question</button>
        <button onClick={handleSaveQuiz}>Save Quiz</button>
        <button onClick={() => setScreen('topic')}>Cancel</button>
      </div>
    );
  };

  const renderMain = () => {
    switch (screen) {
      case 'topic':
        return renderTopicScreen();
      case 'loading':
        return renderLoadingScreen();
      case 'quiz':
        return renderQuizScreen();
      case 'results':
        return renderResultsScreen();
      case 'create':
        return renderCreateScreen();
      default:
        return renderTopicScreen();
    }
  };

  return (
    <div className="App">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="upperSide">
          <div className="upperSideTop">
            <img src={gptLOGO} alt="QuizBOT Logo" className="logo" />
            <span className="brand">QuizBOT</span>
          </div>

          <button className="midBtn" onClick={handleNewQuiz}>
            <img src={addBtn} alt="New Quiz" className="addBtn" />
            New Quiz
          </button>
        </div>

        <div className="lowerSide">
          <div className="listItems">
            <img src={home} alt="Home" className="listItemsImg" />
            Home
          </div>
          <div className="listItems">
            <img src={saved} alt="Saved" className="listItemsImg" />
            Saved
          </div>
          <div className="listItems">
            <img src={rocket} alt="Upgrade" className="listItemsImg" />
            Upgrade To Pro
          </div>
        </div>
      </div>

      <div className="main">
        <button className="toggle-btn" onClick={toggleSidebar}>☰</button>
        {renderMain()}
      </div>
    </div>
  );
}

export default App;
