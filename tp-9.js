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

const playerSprite = document.getElementsByClassName("player")[0];
const monsterSprite = document.getElementsByClassName("monster")[0];

// Sounds
const criticalSound = new Audio("./sounds/critical.mp3");
const victorySound = new Audio("./sounds/victory.mp3");
const hitSound = new Audio("./sounds/hit.mp3");
const healSound = new Audio("./sounds/heal.mp3");

let playerHealth = 100;
let monsterHealth = 100;
let currentRound = 0;
let logMessages = [];
let lastUse = 3;

function updateHealthBars() {
  if (playerHealth >= 0) {
    playerHealthBar.style.width = `${playerHealth}%`;
    if (playerHealth >= 50) {
      playerHealthBar.style.backgroundColor = "lime";
    } else if (playerHealth < 50 && playerHealth >= 20) {
      playerHealthBar.style.backgroundColor = "yellow";
    } else {
      playerHealthBar.style.backgroundColor = "red";
    }
  } else {
    playerHealthBar.style.width = `${0}%`;
  }

  const playerText = document.querySelector("#player h2");
  playerText.textContent = playerHealth <= 0 ? "Player 💀" : "Player ❤️";

  if (monsterHealth >= 0) {
    monsterHealthBar.style.width = `${monsterHealth}%`;
    if (monsterHealth >= 50) {
      monsterHealthBar.style.backgroundColor = "lime";
    } else if (monsterHealth < 50 && monsterHealth >= 20) {
      monsterHealthBar.style.backgroundColor = "yellow";
    } else {
      monsterHealthBar.style.backgroundColor = "red";
    }
  } else {
    monsterHealthBar.style.width = `${0}%`;
  }

  if (playerHealth <= 25 && playerHealth > 0 && monsterHealth > 0) {
    criticalSound.play();
  } else {
    stopSound(criticalSound);
  }

  const monsterText = document.querySelector("#monster h2");
  monsterText.textContent = monsterHealth <= 0 ? "Monstre 💀" : "Monstre ❤️";
}

function stopSound(snd) {
  snd.pause();
  snd.currentTime = 0;
}

function addLogMessage(who, action, value) {
  let message = "";

  switch (action) {
    case "attck":
      message = `${who} a attaqué son adversaire pour ${value} dégats !`;
      break;
    case "heal":
      message = `${who} se soigne. Il récupère ${value} points de vie !`;
      break;
    case "special":
      message = `${who} utilise son attaque spécial et inflige ${value} dégats`;
      break;
  }
  console.log("message", message);
  const p = document.createElement("p");
  p.textContent = message;
  logMessagesList.append(p);
}

function checkWinner() {
  if (playerHealth <= 0 || monsterHealth <= 0) {
    gameOverSection.style.display = "flex";
    gameOverSection.style.justifyContent = "center";
    if (playerHealth <= 0 && monsterHealth > playerHealth) {
      winnerMessage.innerText = "PERDU";
      stopSound(criticalSound);
    } else if (monsterHealth <= 0 && playerHealth > monsterHealth) {
      winnerMessage.innerText = "GAGNÉ";
      victorySound.play();
      stopSound(criticalSound);
    } else {
      winnerMessage.innerText = "Match Nul";
      stopSound(criticalSound);
    }
  }
}
checkWinner(playerHealth, monsterHealth);

const getRandomValue = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

function attackMonster() {
  if (playerSprite.classList.contains("push--player")) {
    setTimeout(() => {
      playerSprite.classList.toggle("push--player");
    }, 500);
  }
  currentRound++;
  let attck = getRandomValue(10, 15);
  monsterHealth -= attck;
  addLogMessage("Le joueur", "attck", attck);
  checkWinner();
  updateSpecialAttackButton();
  updateHealthBars();
  hitSound.play();
  monsterSprite.classList.toggle("push--monster");
  //Changer le tour
  disablePlayerCommands();
  setTimeout(() => {
    attackPlayer();
    enablePlayerCommands();
  }, 1000);
}

function disablePlayerCommands() {
  attackButton.disabled = true;
  healButton.disabled = true;
  surrenderButton.disabled = true;
}

function enablePlayerCommands() {
  attackButton.disabled = false;
  healButton.disabled = false;
  surrenderButton.disabled = false;
}

function attackPlayer() {
  if (monsterSprite.classList.contains("push--monster")) {
    monsterSprite.classList.toggle("push--monster");
  }
  let attck = getRandomValue(10, 25);
  playerHealth -= attck;
  addLogMessage("Le monstre", "attck", attck);
  checkWinner();
  updateHealthBars();
  hitSound.play();
  playerSprite.classList.toggle("push--player");
}

function specialAttackMonster() {
  monsterSprite.classList.toggle("push--monster");
  currentRound += 1;
  let attck = Math.floor(getRandomValue(20, 25));
  monsterHealth -= attck;
  addLogMessage("Le joueur", "special", attck);

  checkWinner();
  updateHealthBars();
  updateSpecialAttackButton();

  //Changer le tour
  disablePlayerCommands();
  lastUse = 3;
  setTimeout(() => {
    attackPlayer();
    enablePlayerCommands();
  }, 1000);
}
function healPlayer() {
  if (playerSprite.classList.contains("push--player")) {
    setTimeout(() => {
      playerSprite.classList.toggle("push--player");
    }, 500);
  }
  // Augmente le compteur de rounds
  currentRound++;

  // Calcule un soin aléatoire (par exemple entre 15 et 25 points de vie)
  const healValue = Math.floor(Math.random() * (25 - 15) + 15);

  // Augmente la santé du joueur, sans dépasser la valeur de 100
  playerHealth = Math.min(playerHealth + healValue, 100);

  // Ajoute un message de log pour le soin
  addLogMessage("Le joueur", "heal", healValue);
  // Joue le son
  healSound.play();
  // Met à jour l'état du bouton d'attaque spéciale (si nécessaire)
  updateSpecialAttackButton();
  // Met à jour les barres de santé
  updateHealthBars();
  // Empêche le joueur de rejouer immédiatement
  disablePlayerCommands();
  // Changer le tour
  setTimeout(() => {
    // Le monstre attaque après
    attackPlayer();
    enablePlayerCommands();
  }, 1000);
}
function updateSpecialAttackButton() {
  if (lastUse == 0) {
    specialAttackButton.disabled = false;
  } else {
    specialAttackButton.disabled = true;
    lastUse -= 1;
  }
}

function surrenderGame() {
  // Déclare le monstre comme gagnant en affichant un message de défaite
  winnerMessage.textContent = "PERDU";
  gameOverSection.style.display = "flex";
  gameOverSection.style.justifyContent = "center";
  stopSound(criticalSound);
}

function resetGame() {
  playerHealth = 100;
  monsterHealth = 100;
  currentRound = 0;
  logMessages = [];
  logMessagesList.innerText = "";
  updateHealthBars();
  winnerMessage.innerText = "";
  gameOverSection.style.display = "none";
  lastUse = 3;
  updateSpecialAttackButton();
  stopSound(victorySound);
}

// Event Listeners
attackButton.addEventListener("click", attackMonster);
specialAttackButton.addEventListener("click", specialAttackMonster);
healButton.addEventListener("click", healPlayer);
surrenderButton.addEventListener("click", surrenderGame);
restartButton.addEventListener("click", resetGame);

// Initialize Game
resetGame();
