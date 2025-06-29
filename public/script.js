let currentQ = 0;
let answers = [];
let currentUserEmail = "";
let timer;
let warningShown = false;
let tabSwitchCount = 0;

let shuffledQuestions = [];
let shuffledCorrectAnswers = [];

const questions = [
  {
    question: "Find the length of the longest subarray with sum 0.",
    options: ["O(n)", "O(n²)", "O(n log n)", "O(1)"]
  },
  {
    question: "Which traversal is used to get postfix expression of a binary tree?",
    options: ["Inorder", "Preorder", "Postorder", "Level order"]
  },
  {
    question: "What is the time complexity of inserting into a Binary Heap?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"]
  },
  {
    question: "Which data structure is used for implementing recursion?",
    options: ["Queue", "Stack", "Array", "Graph"]
  },
  {
    question: "Detect a cycle in a directed graph using:",
    options: ["BFS", "DFS with back edge", "Topological Sort", "All of the above"]
  },
  {
    question: "Which sorting algorithm is best suited for nearly sorted data?",
    options: ["Quick Sort", "Heap Sort", "Insertion Sort", "Selection Sort"]
  },
  {
    question: "What is the maximum number of nodes in a binary tree of height h?",
    options: ["2^h - 1", "2h - 1", "h^2", "h*2"]
  },
  {
    question: "Which of these is not a self-balancing tree?",
    options: ["AVL Tree", "Red-Black Tree", "B Tree", "Binary Search Tree"]
  },
  {
    question: "The minimum spanning tree of a graph can be found using:",
    options: ["Kruskal’s algorithm", "Prim’s algorithm", "Dijkstra’s algorithm", "Both A and B"]
  },
  {
    question: "Dynamic Programming is mainly used when problems have:",
    options: ["Greedy property", "Overlapping subproblems", "Divide and Conquer", "Randomized choice"]
  },
  {
    question: "What is the best case time for Quick Sort?",
    options: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"]
  },
  {
    question: "Which of the following is not a characteristic of a heap?",
    options: ["Complete Binary Tree", "Balanced Tree", "Heap Property", "Binary Tree"]
  },
  {
    question: "In a trie, what is the time complexity of searching a string of length m?",
    options: ["O(m)", "O(log m)", "O(n)", "O(1)"]
  },
  {
    question: "Which algorithm is used to find strongly connected components?",
    options: ["Prim's", "Tarjan's", "Kruskal's", "Bellman-Ford"]
  },
  {
    question: "Find the nth Catalan number is a classic example of:",
    options: ["Greedy", "Backtracking", "Dynamic Programming", "Divide and Conquer"]
  },
  {
    question: "Which data structure is used in topological sorting?",
    options: ["Queue", "Stack", "Linked List", "Priority Queue"]
  },
  {
    question: "Which algorithm is used for all-pairs shortest path?",
    options: ["Dijkstra", "Floyd-Warshall", "Bellman-Ford", "Prim"]
  },
  {
    question: "Which one is a not an amortized analysis technique?",
    options: ["Aggregate", "Accounting", "Potential", "Greedy"]
  },
  {
    question: "Which tree traversal results in sorted output in BST?",
    options: ["Inorder", "Preorder", "Postorder", "Level Order"]
  },
  {
    question: "What is the auxiliary space for Merge Sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"]
  },
  {
    question: "Which algorithm is used in finding articulation points?",
    options: ["Dijkstra", "Tarjan", "Kruskal", "Bellman-Ford"]
  },
  {
    question: "What is the time complexity of searching in a balanced BST?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"]
  },
  {
    question: "Which algorithm is used for maximum subarray sum?",
    options: ["Kruskal", "Kadane’s", "Dijkstra", "KMP"]
  },
  {
    question: "Which data structure supports LRU Cache?",
    options: ["Stack and Queue", "Set and Map", "Deque and HashMap", "Array and Stack"]
  },
  {
    question: "Which is used in pattern matching?",
    options: ["KMP", "Rabin-Karp", "Z-Algorithm", "All of the above"]
  },
  {
    question: "Which tree has maximum height for n nodes?",
    options: ["BST", "AVL", "Skewed BST", "Red-Black"]
  },
  {
    question: "Which of the following problems uses backtracking?",
    options: ["N-Queens", "Sudoku Solver", "Rat in Maze", "All of the above"]
  },
  {
    question: "Which is true about Bellman-Ford?",
    options: ["Faster than Dijkstra", "Works for negative weights", "Only for undirected graphs", "All of the above"]
  },
  {
    question: "What’s the time complexity of building a heap?",
    options: ["O(n log n)", "O(log n)", "O(n)", "O(1)"]
  },
  {
    question: "Which is not a stable sorting algorithm?",
    options: ["Merge Sort", "Bubble Sort", "Quick Sort", "Insertion Sort"]
  }
];

const correctAnswers = [
  "O(n)", "Postorder", "O(log n)", "Stack", "All of the above", "Insertion Sort", "2^h - 1", "Binary Search Tree", "Both A and B", "Overlapping subproblems",
  "O(n log n)", "Balanced Tree", "O(m)", "Tarjan's", "Dynamic Programming", "Stack", "Floyd-Warshall", "Greedy", "Inorder", "O(n)",
  "Tarjan", "O(log n)", "Kadane’s", "Deque and HashMap", "All of the above", "Skewed BST", "All of the above", "Works for negative weights", "O(n)", "Quick Sort"
];


function shuffleArray(arr) {
  let temp = [...arr];
  for (let i = temp.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [temp[i], temp[j]] = [temp[j], temp[i]];
  }
  return temp;
}

function showSection(id) {
  ["registerForm", "loginForm", "quizSection"].forEach(sec => {
    document.getElementById(sec).classList.remove("active");
  });
  document.getElementById(id).classList.add("active");

  const quizHeader = document.getElementById("quizHeader");
  quizHeader.style.display = id === "quizSection" ? "flex" : "none";

  if (id === "quizSection") {
    startTestTimer();
  }
}

function register() {
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (password !== confirm) return alert("Passwords do not match.");

  fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  }).then(res => res.json()).then(data => {
    alert(data.message);
    if (data.success) showSection("loginForm");
  });
}

function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(res => res.json()).then(data => {
    if (data.success) {
      currentUserEmail = data.email;
      warningShown = false;
      tabSwitchCount = 0;

      const indices = shuffleArray([...Array(questions.length).keys()]);
      shuffledQuestions = indices.map(i => questions[i]);
      shuffledCorrectAnswers = indices.map(i => correctAnswers[i]);
      answers = new Array(shuffledQuestions.length).fill("");

      currentQ = 0;
      showSection("quizSection");
      loadQuestion();
    } else {
      alert(data.message);
    }
  });
}

function loadQuestion() {
  document.getElementById("questionCount").innerText =
    `Question ${currentQ + 1} of ${shuffledQuestions.length}`;

  const q = shuffledQuestions[currentQ];
  let html = `<h3>${q.question}</h3>`;
  q.options.forEach(opt => {
    html += `
      <label>
        <input type="radio" name="option" value="${opt}"
        ${answers[currentQ] === opt ? "checked" : ""}/> ${opt}
      </label><br>`;
  });

  document.getElementById("questionBox").innerHTML = html;
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

function calculateScore() {
  return answers.reduce(
    (sum, ans, idx) => sum + (ans === shuffledCorrectAnswers[idx] ? 1 : 0),
    0
  );
}

function submitAnswers() {
  saveAnswer();
  if (!confirm("⚠️ Are you sure you want to submit your answers?")) return;
  if (!confirm("📌 This action is final. Submit now?")) return;

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
  }).then(res => res.json()).then(data => {
    if (data.success) {
      clearInterval(timer);
      let summary = `
        <h2>✅ Test Submitted Successfully!</h2>
        <p>Your Score: ${score} / ${shuffledQuestions.length}</p><hr>`;
      shuffledQuestions.forEach((q, i) => {
        summary += `
          <div>
            <strong>Q${i + 1}:</strong> ${q.question}<br>
            Your Answer: <mark>${answers[i] || "Not Answered"}</mark><br>
            Correct: <strong>${shuffledCorrectAnswers[i]}</strong><br><br>
          </div>`;
      });
      summary += `<button onclick="logout()">Logout</button>`;
      document.getElementById("quizSection").innerHTML = summary;
    } else {
      alert(data.message || "Something went wrong.");
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

// Timer
function startTestTimer() {
  let totalSec = 45 * 60;
  clearInterval(timer);
  timer = setInterval(() => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    document.getElementById("timerDisplay").innerText =
      `Time left: ${m}m ${s}s`;

    if (totalSec === 600 && !warningShown) {
      alert("⚠️ 10 minutes remaining!");
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

// Tab switch detection
document.addEventListener("visibilitychange", () => {
  const quizVisible = document.getElementById("quizSection").classList.contains("active");

  if (document.hidden && quizVisible && currentUserEmail) {
    fetch('/warn-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: currentUserEmail })
    })
    .then(res => res.json())
    .then(data => {
      if (data.blocked) {
        alert(data.message + "\nLogging you out...");
        logout();
      } else {
        alert(data.message);
      }
    });
  }
});
