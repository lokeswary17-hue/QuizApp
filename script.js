/**
 * General Knowledge Quiz Web App
 * Pure Vanilla JavaScript implementation
 */

// ==========================================================
// 1. QUIZ QUESTIONS DATA
// ==========================================================
const questions = [
  {
    question: "What is the capital city of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    answer: 2 // Canberra
  },
  {
    question: "Which planet in our solar system is known as the 'Red Planet'?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    answer: 1 // Mars
  },
  {
    question: "Who painted the famous masterpiece 'Mona Lisa'?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
    answer: 2 // Leonardo da Vinci
  },
  {
    question: "What is the largest and deepest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    answer: 3 // Pacific Ocean
  },
  {
    question: "What is the chemical symbol for the element Gold?",
    options: ["Au", "Ag", "Fe", "Gd"],
    answer: 0 // Au
  },
  {
    question: "In which year did the RMS Titanic sink after hitting an iceberg?",
    options: ["1905", "1912", "1918", "1923"],
    answer: 1 // 1912
  },
  {
    question: "What is the hardest naturally occurring substance on Earth?",
    options: ["Quartz", "Granite", "Diamond", "Topaz"],
    answer: 2 // Diamond
  },
  {
    question: "Which country is the natural habitat of the wild kangaroo?",
    options: ["South Africa", "Brazil", "Australia", "New Zealand"],
    answer: 2 // Australia
  },
  {
    question: "How many continents are there on planet Earth?",
    options: ["5", "6", "7", "8"],
    answer: 2 // 7
  },
  {
    question: "Which chemical element has the atomic number 1 on the periodic table?",
    options: ["Helium", "Hydrogen", "Carbon", "Oxygen"],
    answer: 1 // Hydrogen
  }
];

const TIMER_DURATION = 15; // 15 seconds per question
const STORAGE_KEY = "quiz_app_high_score";

// ==========================================================
// 2. DOM ELEMENT REFERENCES
// ==========================================================
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

// Start Screen elements
const startBtn = document.getElementById("start-btn");
const highScoreValue = document.getElementById("high-score-value");

// Quiz Screen elements
const currentQuestionNumEl = document.getElementById("current-question-num");
const totalQuestionsNumEl = document.getElementById("total-questions-num");
const timerBadge = document.getElementById("timer-badge");
const timerText = document.getElementById("timer-text");
const progressBar = document.getElementById("progress-bar");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const feedbackMsg = document.getElementById("feedback-msg");
const nextBtn = document.getElementById("next-btn");

// Result Screen elements
const resultEmoji = document.getElementById("result-emoji");
const resultMessage = document.getElementById("result-message");
const finalScoreEl = document.getElementById("final-score");
const finalTotalEl = document.getElementById("final-total");
const scorePercentageEl = document.getElementById("score-percentage");
const resultHighScoreBanner = document.getElementById("result-high-score-banner");
const resultHighScoreText = document.getElementById("result-high-score-text");
const restartBtn = document.getElementById("restart-btn");
const homeBtn = document.getElementById("home-btn");

// ==========================================================
// 3. APPLICATION STATE
// ==========================================================
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = TIMER_DURATION;
let timerInterval = null;
let autoAdvanceTimeout = null;
let isAnswered = false;

// ==========================================================
// 4. LOCAL STORAGE HELPERS
// ==========================================================
function getStoredHighScore() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? parseInt(saved, 10) : 0;
  } catch (e) {
    console.warn("localStorage is not available:", e);
    return 0;
  }
}

function saveHighScore(newScore) {
  try {
    localStorage.setItem(STORAGE_KEY, newScore.toString());
  } catch (e) {
    console.warn("Unable to save to localStorage:", e);
  }
}

function updateStartScreenHighScore() {
  const highScore = getStoredHighScore();
  highScoreValue.textContent = `${highScore} / ${questions.length}`;
}

// ==========================================================
// 5. SCREEN TRANSITIONS
// ==========================================================
function showScreen(screenToShow) {
  [startScreen, quizScreen, resultScreen].forEach((screen) => {
    screen.classList.remove("active");
  });
  screenToShow.classList.add("active");
}

// ==========================================================
// 6. TIMER LOGIC
// ==========================================================
function startTimer() {
  clearInterval(timerInterval);
  clearTimeout(autoAdvanceTimeout);
  timeLeft = TIMER_DURATION;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  clearTimeout(autoAdvanceTimeout);
}

function updateTimerDisplay() {
  timerText.textContent = `${timeLeft}s`;

  if (timeLeft <= 5) {
    timerBadge.classList.add("warning");
  } else {
    timerBadge.classList.remove("warning");
  }
}

// ==========================================================
// 7. QUESTION RENDERING & PROGRESS
// ==========================================================
function loadQuestion() {
  isAnswered = false;
  clearTimeout(autoAdvanceTimeout);
  const currentQ = questions[currentQuestionIndex];

  // Update progress indicators
  currentQuestionNumEl.textContent = currentQuestionIndex + 1;
  totalQuestionsNumEl.textContent = questions.length;
  
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
  progressBar.style.width = `${progressPercent}%`;

  // Render question text
  questionText.textContent = currentQ.question;

  // Clear options and reset UI controls
  optionsContainer.innerHTML = "";
  feedbackMsg.textContent = "";
  feedbackMsg.className = "feedback-msg";
  nextBtn.style.display = "none";

  // Change button text for the last question
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  nextBtn.querySelector("span").textContent = isLastQuestion ? "View Results" : "Next Question";

  // Option keys (A, B, C, D)
  const optionKeys = ["A", "B", "C", "D"];

  // Render options
  currentQ.options.forEach((optText, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.dataset.index = index;

    btn.innerHTML = `
      <span class="option-key">${optionKeys[index]}</span>
      <span class="option-text">${escapeHtml(optText)}</span>
      <span class="option-status-icon"></span>
    `;

    btn.addEventListener("click", () => handleOptionClick(index));
    optionsContainer.appendChild(btn);
  });

  // Start question countdown
  startTimer();
}

// Utility to prevent HTML injection in question text
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ==========================================================
// 8. OPTION SELECTION & FEEDBACK
// ==========================================================
function handleOptionClick(selectedIndex) {
  if (isAnswered) return;
  isAnswered = true;
  stopTimer();

  const currentQ = questions[currentQuestionIndex];
  const optionButtons = optionsContainer.querySelectorAll(".option-btn");
  const isCorrect = selectedIndex === currentQ.answer;

  if (isCorrect) {
    score++;
    feedbackMsg.textContent = "Correct! Great job! 🎉";
    feedbackMsg.className = "feedback-msg correct-msg";
  } else {
    feedbackMsg.textContent = "Oops! Incorrect answer. ❌";
    feedbackMsg.className = "feedback-msg wrong-msg";
  }

  // Highlight choices and disable clicks
  optionButtons.forEach((btn, idx) => {
    btn.disabled = true;
    const statusIcon = btn.querySelector(".option-status-icon");

    if (idx === currentQ.answer) {
      btn.classList.add("correct");
      statusIcon.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (idx === selectedIndex && !isCorrect) {
      btn.classList.add("wrong");
      statusIcon.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    } else {
      btn.classList.add("dimmed");
    }
  });

  // Reveal next button
  nextBtn.style.display = "inline-flex";
}

// ==========================================================
// 9. TIMEOUT HANDLER
// ==========================================================
function handleTimeout() {
  if (isAnswered) return;
  isAnswered = true;

  const currentQ = questions[currentQuestionIndex];
  const optionButtons = optionsContainer.querySelectorAll(".option-btn");

  feedbackMsg.textContent = "Time's up! ⏰ The correct answer is highlighted.";
  feedbackMsg.className = "feedback-msg timeout-msg";

  // Highlight the correct answer and disable all buttons
  optionButtons.forEach((btn, idx) => {
    btn.disabled = true;
    const statusIcon = btn.querySelector(".option-status-icon");

    if (idx === currentQ.answer) {
      btn.classList.add("correct");
      statusIcon.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else {
      btn.classList.add("dimmed");
    }
  });

  // Show Next button immediately
  nextBtn.style.display = "inline-flex";

  // Automatically move to next question after 2.5 seconds if user hasn't clicked Next
  autoAdvanceTimeout = setTimeout(() => {
    goToNextQuestion();
  }, 2500);
}

// ==========================================================
// 10. NAVIGATION (NEXT / FINISH)
// ==========================================================
function goToNextQuestion() {
  stopTimer();
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

// ==========================================================
// 11. RESULTS SCREEN
// ==========================================================
function showResults() {
  stopTimer();
  showScreen(resultScreen);

  finalScoreEl.textContent = score;
  finalTotalEl.textContent = questions.length;

  const percentage = Math.round((score / questions.length) * 100);
  scorePercentageEl.textContent = `${percentage}% Accuracy`;

  // Feedback message and emoji based on score
  if (score >= 8) {
    resultEmoji.textContent = "🏆";
    resultMessage.textContent = "Excellent! You're a true trivia master!";
  } else if (score >= 5) {
    resultEmoji.textContent = "🎉";
    resultMessage.textContent = "Good job! You've got solid general knowledge.";
  } else {
    resultEmoji.textContent = "📚";
    resultMessage.textContent = "Keep practicing! You can do better next time.";
  }

  // Handle High Score logic
  const previousHighScore = getStoredHighScore();
  const isNewHighScore = score > previousHighScore;

  if (isNewHighScore) {
    saveHighScore(score);
    resultHighScoreBanner.classList.add("highlight");
    resultHighScoreText.innerHTML = `🎉 <strong>New High Score: ${score} / ${questions.length}!</strong>`;
  } else {
    resultHighScoreBanner.classList.remove("highlight");
    resultHighScoreText.innerHTML = `High Score: <strong>${previousHighScore} / ${questions.length}</strong>`;
  }
}

// ==========================================================
// 12. INITIALIZATION & RESTART
// ==========================================================
function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  showScreen(quizScreen);
  loadQuestion();
}

function initApp() {
  updateStartScreenHighScore();
  showScreen(startScreen);

  // Event Listeners
  startBtn.addEventListener("click", startQuiz);

  nextBtn.addEventListener("click", () => {
    clearTimeout(autoAdvanceTimeout);
    goToNextQuestion();
  });

  restartBtn.addEventListener("click", startQuiz);

  homeBtn.addEventListener("click", () => {
    updateStartScreenHighScore();
    showScreen(startScreen);
  });
}

// Run on page load
document.addEventListener("DOMContentLoaded", initApp);
