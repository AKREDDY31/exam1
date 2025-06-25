let currentQ = 0;
let answers = [];
let currentUserEmail = "";
let timer;
let warningShown = false;

let shuffledQuestions = [];
let shuffledCorrectAnswers = [];

const questions = [
  { question: "If a train travels 60 km in 1.5 hours, what is its speed?", options: ["40 km/h", "50 km/h", "60 km/h", "45 km/h"] },
  { question: "What is the antonym of 'benevolent'?", options: ["Kind", "Cruel", "Generous", "Noble"] },
  { question: "Find the missing number: 2, 6, 12, 20, ?", options: ["28", "30", "32", "36"] },
  { question: "Select the odd one out: Apple, Banana, Carrot, Mango", options: ["Apple", "Banana", "Carrot", "Mango"] },
  { question: "Choose the word most similar in meaning to 'Arrogant'", options: ["Humble", "Proud", "Kind", "Weak"] },
  { question: "If 5x = 25, what is x?", options: ["10", "5", "3", "2"] },
  { question: "What comes next in the series: 3, 6, 12, 24, ?", options: ["36", "48", "42", "60"] },
  { question: "Which word is incorrectly spelled?", options: ["Occasion", "Definately", "Maintenance", "Environment"] },
  { question: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"] },
  { question: "Solve: (8 × 3) + (6 ÷ 2)", options: ["27", "26", "24", "30"] },
  { question: "Rearrange the word: 'TTIANMEC'", options: ["CEMENTAT", "ATTEMNIC", "ENACTTIM", "ATTICMEN"] },
  { question: "Which number is divisible by 9?", options: ["123", "162", "145", "134"] },
  { question: "Spot the error: He don't like cricket.", options: ["He", "don't", "like", "cricket"] },
  { question: "Select the correct analogy: Book is to Reading as Fork is to ?", options: ["Drawing", "Writing", "Stirring", "Eating"] },
  { question: "Find the next term: A, C, F, J, O, ?", options: ["U", "V", "W", "X"] },
  { question: "What is 25% of 160?", options: ["30", "35", "40", "50"] },
  { question: "Which is heavier: 1 kg of cotton or 1 kg of iron?", options: ["Cotton", "Iron", "Both same", "Cannot say"] },
  { question: "Choose the correct spelling:", options: ["Accomodation", "Accommodation", "Acommodation", "Acomodation"] },
  { question: "What comes next? 1, 1, 2, 3, 5, 8, ?", options: ["11", "12", "13", "14"] },
  { question: "Which is a synonym of 'Rapid'?", options: ["Fast", "Lazy", "Late", "Soft"] },
  { question: "If the day before yesterday was Friday, what day is tomorrow?", options: ["Sunday", "Monday", "Tuesday", "Wednesday"] },
  { question: "Which number is a perfect square?", options: ["50", "64", "70", "85"] },
  { question: "Complete the series: Z, Y, X, W, ?", options: ["V", "U", "T", "S"] },
  { question: "What is the plural of 'Mouse'?", options: ["Mouses", "Mouse", "Mice", "Mices"] },
  { question: "Which shape has 6 sides?", options: ["Square", "Pentagon", "Hexagon", "Octagon"] },
  { question: "Find the odd one: Red, Blue, Yellow, Square", options: ["Red", "Blue", "Yellow", "Square"] },
  { question: "How many degrees in a right angle?", options: ["45°", "60°", "90°", "180°"] },
  { question: "Which is a vowel?", options: ["B", "C", "E", "F"] },
  { question: "Which is the fastest means of transport?", options: ["Train", "Car", "Aeroplane", "Ship"] },
  { question: "What is the synonym of 'Diligent'?", options: ["Lazy", "Careless", "Hardworking", "Slow"] }
];
const correctAnswers = [
  "40 km/h", "Cruel", "30", "Carrot", "Proud", "5", "48", "Definately", "Canberra", "27",
  "ATTICMEN", "162", "don't", "Eating", "U", "40", "Both same", "Accommodation", "13", "Fast",
  "Sunday", "64", "V", "Mice", "Hexagon", "Square", "90°", "E", "Aeroplane", "Hardworking"
];

// Shuffle helper
function shuffleArray(arr) {
  let temp = [...arr];
  for (let i = temp.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [temp[i], temp[j]] = [temp[j], temp[i]];
  }
  return temp;
}

// ------------------------- Core Functions ---------------------------

function showSection(id) {
  ["registerForm", "loginForm", "quizSection"].forEach(sec => {
    document.getElementById(sec).classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

function register() {
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (password !== confirm) {
    return alert("Passwords do not match.");
  }

  fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("✅ Registered successfully!");
        showSection("loginForm");
      } else {
        alert(data.message);
      }
    });
}

function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        currentUserEmail = data.email;
        warningShown = false;

        // Shuffle questions & answers
        const indices = shuffleArray([...Array(questions.length).keys()]);
        shuffledQuestions = indices.map(i => questions[i]);
        shuffledCorrectAnswers = indices.map(i => correctAnswers[i]);
        answers = new Array(shuffledQuestions.length).fill("");

        currentQ = 0;
        showSection("quizSection");
        loadQuestion();
        startTestTimer();
      } else {
        alert(data.message);
      }
    });
}

// ------------------------- Question Navigation ---------------------------

function loadQuestion() {
  document.getElementById("questionCount").innerText =
    `Question ${currentQ + 1} of ${shuffledQuestions.length}`;

  const q = shuffledQuestions[currentQ];
  let html = `<h3>${q.question}</h3>`;
  q.options.forEach(opt => {
    html +=
      `<label>
         <input type="radio" name="option" value="${opt}"
           ${answers[currentQ] === opt ? "checked" : ""}/>
         ${opt}
       </label><br>`;
  });

  document.getElementById("questionBox").innerHTML = html;
  document.getElementById("submitBtn").style.display =
    (currentQ === shuffledQuestions.length - 1) ? "inline-block" : "none";
}

function saveAnswer() {
  const sel = document.querySelector('input[name="option"]:checked');
  if (sel) answers[currentQ] = sel.value;
}

function nextQuestion() {
  saveAnswer();
  if (currentQ < shuffledQuestions.length - 1) {
    currentQ++;
    loadQuestion();
  }
}

function prevQuestion() {
  saveAnswer();
  if (currentQ > 0) {
    currentQ--;
    loadQuestion();
  }
}

// ------------------------- Submission & Scoring ---------------------------

function calculateScore() {
  return answers.reduce(
    (sum, ans, idx) => sum + (ans === shuffledCorrectAnswers[idx] ? 1 : 0),
    0
  );
}

function submitAnswers() {
  saveAnswer();
  if (!confirm("Are you sure you want to submit?")) return;

  const score = calculateScore();

  fetch('/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: currentUserEmail,
      answers,
      score,
      timestamp: new Date().toISOString()
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        clearInterval(timer);

        let summary = `
          <h2>✅ Test Submitted Successfully!</h2>
          <p>Your Score: ${score} / ${shuffledQuestions.length}</p>
          <hr>
        `;
        shuffledQuestions.forEach((q, i) => {
          summary += `
            <div>
              <strong>Q${i+1}:</strong> ${q.question}<br>
              Your Answer: <mark>${answers[i]||"Not Answered"}</mark><br>
              Correct: <strong>${shuffledCorrectAnswers[i]}</strong><br><br>
            </div>
          `;
        });
        summary += `<button onclick="logout()">Logout</button>`;
        document.getElementById("quizSection").innerHTML = summary;
      } else {
        alert("Something went wrong. Please try again.");
      }
    });
}

function logout() {
  showSection("loginForm");
  currentUserEmail = "";
  currentQ = 0;
  answers = [];
  clearInterval(timer);
  document.getElementById("timerDisplay").innerText = "";
}

// ------------------------- Overall Test Timer ---------------------------

function startTestTimer() {
  let totalSec = 20 * 60; // 45 minutes
  timer = setInterval(() => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    document.getElementById("timerDisplay").innerText =
      `Time left: ${m}m ${s}s`;

    if (totalSec === 120 && !warningShown) {
      alert("⚠️ 2 minutes remaining!");
      warningShown = true;
    }
    if (totalSec <= 0) {
      clearInterval(timer);
      alert("⏰ Time's up! Auto-submitting...");
      submitAnswers();
    }
    totalSec--;
  }, 1000);
}
