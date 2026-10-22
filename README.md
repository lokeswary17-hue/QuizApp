# 🧠 General Knowledge Quiz Web App

A clean, modern, and responsive interactive Quiz Web Application built using **pure HTML, CSS, and Vanilla JavaScript**. No external libraries, frameworks, backends, or API keys are required.

---

## ✨ Features

- **🎯 Start Screen**:
  - Displays quiz title, summary badges, and instructions.
  - Automatically loads and displays your persistent **High Score** from `localStorage`.
  - Prominent "Start Quiz" button with hover animations.

- **📚 10 General Knowledge Questions**:
  - Pre-loaded array of 10 trivia questions covering geography, science, history, and art.
  - 4 multiple-choice options per question with badges (A, B, C, D).

- **📊 Progress Tracking**:
  - Real-time question indicator (e.g., *Question 3 of 10*).
  - Smooth animated progress bar that dynamically fills as you advance through the quiz.

- **⚡ Instant Interactive Feedback**:
  - Clicking an option immediately reveals:
    - 🟩 **Green highlight & checkmark** on the correct answer.
    - 🟥 **Red highlight & cross mark** on the wrong answer if an incorrect choice was made.
    - Dimmed inactive state on other options to prevent multiple submissions.
  - Explanatory feedback message (*"Correct! Great job! 🎉"* or *"Oops! Incorrect answer. ❌"*).
  - Displays a clean **Next Question** button (or **View Results** on the final question).

- **⏱️ 15-Second Countdown Timer**:
  - 15-second per-question timer with stopwatch icon badge.
  - Visual pulse animation and red warning styling when 5 seconds or fewer remain.
  - If the timer hits zero:
    - Marks the question as wrong (no points awarded).
    - Reveals the correct answer in green.
    - Shows a "Time's up! ⏰" alert.
    - Displays the Next button and smoothly moves on.

- **🏆 Results Screen & Performance Analysis**:
  - Displays final score (e.g., `8 / 10`) along with calculated percentage accuracy (`80% Accuracy`).
  - Score-based encouragement message:
    - **8–10 points:** *"Excellent! You're a true trivia master!"* 🏆
    - **5–7 points:** *"Good job! You've got solid general knowledge."* 🎉
    - **0–4 points:** *"Keep practicing! You can do better next time."* 📚
  - Automatically checks against your historical high score and celebrates if you set a new record (`🎉 New High Score!`).
  - **"Play Again"** button to immediately restart, plus a **"Home Screen"** button to return to the welcome screen.

- **💾 Persistent High Score**:
  - Utilizes browser `localStorage` (`quiz_app_high_score`) so high scores persist even when refreshing or reopening the browser.

- **🌿 "Sage Green" Palette & Mobile-Friendly UI**:
  - Soft cream-sage background (`#F1F5EC` to `#E4EBDD`) with subtle organic ambient shapes.
  - Solid white cards (`#FFFFFF`) with 20px rounded corners and a soft sage shadow (`rgba(95, 127, 91, 0.2)`).
  - Sage green primary buttons (`#8FAE8B` with hover `#5F7F5B`), secondary buttons & progress bar (`#C9D8C5` & `#5F7F5B`), and soft red error states (`#D96C6C`).
  - Small warm terracotta highlights (`#D9A58B`) for badges, streaks, and score accents.
  - Deep forest text (`#2F3A2F`) with bolder headings rendered using modern Google Fonts (*DM Sans* & *Poppins*).
  - Smooth hover lift and click press animations.
  - Fully responsive layout optimized for mobile screens, tablets, and desktops.

---

## 📁 Project Structure

```plaintext
QUIZ APP/
├── index.html       # Markup structure for Start, Quiz, and Result screens
├── style.css        # CSS styling, gradient theme, animations, and responsive media queries
├── script.js        # Questions data, state management, timer logic, and localStorage handling
└── README.md        # Comprehensive documentation
```

---

## 🚀 How to Run the App

Because this app uses standard vanilla web technologies with no build steps or dependencies, you can run it immediately using any of the following methods:

### Method 1: Direct File Open (Easiest)
1. Navigate to the `QUIZ APP` folder in your file explorer.
2. Double-click **`index.html`** or right-click and choose **Open with > Google Chrome / Microsoft Edge / Mozilla Firefox / Safari**.

### Method 2: VS Code Live Server
1. Open the project folder in [Visual Studio Code](https://code.visualstudio.com/).
2. Install the **Live Server** extension if you haven't already.
3. Right-click `index.html` and click **"Open with Live Server"**.

### Method 3: Simple Local Python Server
Open a terminal inside the project directory and run:
```bash
# Python 3
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

---

## ⚙️ Customization Guide

### 1. Adding or Modifying Questions
Open `script.js` and locate the `questions` array near the top of the file:

```javascript
const questions = [
  {
    question: "What is the capital city of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    answer: 2 // Index of the correct option in options array (0-indexed: 2 is Canberra)
  },
  // Add your own questions here...
];
```
- Each question object requires:
  - `question`: The question text string.
  - `options`: An array of 4 possible answers.
  - `answer`: The zero-based index of the correct answer (`0` for option A, `1` for B, `2` for C, `3` for D).

### 2. Changing the Question Timer Duration
In `script.js`, edit `TIMER_DURATION`:
```javascript
const TIMER_DURATION = 15; // Set to any number of seconds (e.g., 20 or 30)
```

### 3. Adjusting Score Thresholds and Feedback
In `script.js`, locate the `showResults()` function:
```javascript
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
```

---

## 📱 Browser Compatibility

Compatible with all modern browsers:
- Google Chrome (Desktop & Mobile)
- Microsoft Edge
- Mozilla Firefox
- Safari (macOS & iOS)
- Brave / Opera

---

## 📄 License

This project is open-source and free to use for educational and personal projects.
