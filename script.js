
let words = {
  easy: [{ word: "cat", spanish: "gato" }, { word: "dog", spanish: "perro" }],
  medium: [{ word: "pencil", spanish: "lápiz" }, { word: "window", spanish: "ventana" }],
  hard: [{ word: "elephant", spanish: "elefante" }, { word: "astronomy", spanish: "astronomía" }]
};

let currentList = [], index = 0, score = 0, lives = 3, streak = 0;

function startLevelMode() {
  currentList = [...words.easy, ...words.medium, ...words.hard];
  shuffle(currentList);
  index = score = streak = 0;
  lives = 3;
  showSection("game");
}

function startCupMode() {
  currentList = [
    ...words.easy.slice(0, 2),
    ...words.medium.slice(0, 2),
    ...words.hard.slice(0, 2)
  ];
  shuffle(currentList);
  index = score = streak = 0;
  lives = 3;
  showSection("game");
}

function showSection(section) {
  document.getElementById("mode-selection").style.display = section === "menu" ? "block" : "none";
  document.getElementById("game-area").style.display = section === "game" ? "block" : "none";
  document.getElementById("results-area").style.display = section === "results" ? "block" : "none";
  if (section === "game") showWord();
}

function showWord() {
  if (lives <= 0) return endGame();
  if (index >= currentList.length) return endGame();
  document.getElementById("spanish-word").textContent = currentList[index].spanish;
  document.getElementById("user-input").value = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("next-button").style.display = "none";
  document.getElementById("lives").textContent = "❤️".repeat(lives);
  document.getElementById("progress").textContent = `Progreso: ${index + 1}/${currentList.length}`;
  document.getElementById("score").textContent = `Puntaje: ${score}`;
}

function checkAnswer() {
  const input = document.getElementById("user-input").value.trim().toLowerCase();
  const correct = currentList[index].word.toLowerCase();
  if (input === correct) {
    score += 10;
    streak++;
    if (streak % 3 === 0) lives++;
    index++;
    showWord();
  } else {
    lives--;
    streak = 0;
    document.getElementById("feedback").textContent = `Incorrecto. Era "${correct}", escribiste "${input}"`;
    document.getElementById("next-button").style.display = "block";
  }
  document.getElementById("lives").textContent = "❤️".repeat(lives);
  document.getElementById("score").textContent = `Puntaje: ${score}`;
}

function nextWord() {
  index++;
  showWord();
}

function endGame() {
  showSection("results");
  document.getElementById("final-score").textContent = `Puntaje final: ${score}`;
}

function goHome() {
  showSection("menu");
}

function saveScore() {
  let name = document.getElementById("player-name").value;
  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  scores.push({ name, score });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem("scores", JSON.stringify(scores.slice(0, 10)));
  updateHighScores();
}

function updateHighScores() {
  let list = document.getElementById("highscore-list");
  list.innerHTML = "";
  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  for (let s of scores) {
    let li = document.createElement("li");
    li.textContent = `${s.name}: ${s.score}`;
    list.appendChild(li);
  }
}

function playAudio() {
  let utter = new SpeechSynthesisUtterance(currentList[index].word);
  speechSynthesis.speak(utter);
}

function playSlowAudio() {
  let utter = new SpeechSynthesisUtterance(currentList[index].word);
  utter.rate = 0.5;
  speechSynthesis.speak(utter);
}

function playExtraSlowAudio() {
  let utter = new SpeechSynthesisUtterance(currentList[index].word);
  utter.rate = 0.25;
  speechSynthesis.speak(utter);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

window.onload = updateHighScores;
