// DOM Elements
const playerHealthBar = document.getElementById("player-health");
const monsterHealthBar = document.getElementById("monster-health");
const logMessagesList = document.getElementById("log-messages");
const gameOverSection = document.getElementById("game-over");
const winnerMessage = document.getElementById("winner-message");
const restartButton = document.getElementById("restart-button");
const attackButton = document.getElementById("attack-button");
const specialAttackButton = document.getElementById("special-attack-button");
const healButton = document.getElementById("heal-button");
const surrenderButton = document.getElementById("surrender-button");

let playerHealth = 100;
let monsterHealth = 100;
let currentRound = 0;
let logMessages = [];

function updateHealthBars() {
  playerHealthBar.style.width = `${playerHealth}%`;
  monsterHealthBar.style.width = `${playerHealth}%`;
}

function addLogMessage(who, action, value) {}

function checkWinner() {}

function resetGame() {}

function attackMonster() {
  console.log(playerHealth);
  playerHealth -= 10;
  updateHealthBars();
}

function attackPlayer() {}

function specialAttackMonster() {}

function healPlayer() {}

function surrenderGame() {}

function updateSpecialAttackButton() {}

// Event Listeners
attackButton.addEventListener("click", attackMonster);
specialAttackButton.addEventListener("click", specialAttackMonster);
healButton.addEventListener("click", healPlayer);
surrenderButton.addEventListener("click", surrenderGame);
restartButton.addEventListener("click", resetGame);

// Initialize Game
resetGame();
