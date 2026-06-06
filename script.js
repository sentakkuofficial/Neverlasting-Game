let playerHp = 100;
let enemyHp = 50;
let level = 1;

let enemies = [
  { name: "Band Hunter", hp: 50, attack: 10 },
  { name: "Iron-Leg Fighter", hp: 70, attack: 14 },
  { name: "Vidar's Enforcer", hp: 90, attack: 18 }
];

let currentEnemy = enemies[0];

function updateScreen() {
  document.getElementById("playerHp").textContent = playerHp;
  document.getElementById("enemyHp").textContent = enemyHp;
  document.getElementById("enemyName").textContent = currentEnemy.name;
}

function enemyAttack() {
  let damage = Math.floor(Math.random() * currentEnemy.attack) + 5;
  playerHp -= damage;

  document.getElementById("message").textContent += 
    ` ${currentEnemy.name} strikes back for ${damage} damage!`;

  checkGame();
  updateScreen();
}

function chainStrike() {
  let damage = Math.floor(Math.random() * 15) + 8;
  enemyHp -= damage;

  document.getElementById("message").textContent =
    `Ichido swings his copper chain and deals ${damage} damage!`;

  if (enemyHp > 0) {
    enemyAttack();
  } else {
    nextLevel();
  }

  updateScreen();
}

function defend() {
  let damage = Math.floor(Math.random() * 6) + 2;
  playerHp -= damage;

  document.getElementById("message").textContent =
    `Ichido defends with his chain. He only takes ${damage} damage.`;

  checkGame();
  updateScreen();
}

function powerAttack() {
  let hitChance = Math.random();

  if (hitChance > 0.5) {
    let damage = Math.floor(Math.random() * 25) + 15;
    enemyHp -= damage;

    document.getElementById("message").textContent =
      `Ichido risks everything and lands a brutal hit for ${damage} damage!`;

    if (enemyHp <= 0) {
      nextLevel();
    } else {
      enemyAttack();
    }
  } else {
    document.getElementById("message").textContent =
      "Ichido misses. Fear slows him down.";

    enemyAttack();
  }

  updateScreen();
}

function nextLevel() {
  level++;

  if (level > enemies.length) {
    document.getElementById("story").textContent =
      "Ichido survives the Grand Selection... but the nightmare is only beginning.";
    document.getElementById("message").textContent =
      "YOU WIN — To be continued in Neverlasting: Bonds.";
    return;
  }

  currentEnemy = enemies[level - 1];
  enemyHp = currentEnemy.hp;
  playerHp += 20;

  document.getElementById("story").textContent =
    `Level ${level} begins. ${currentEnemy.name} steps forward.`;

  document.getElementById("message").textContent =
    "Ichido remembers Nayuri and keeps moving. +20 HP restored.";
}

function checkGame() {
  if (playerHp <= 0) {
    playerHp = 0;
    document.getElementById("story").textContent =
      "Ichido collapses. The tournament claims another victim.";
    document.getElementById("message").textContent =
      "GAME OVER";
  }
}

function restartGame() {
  playerHp = 100;
  level = 1;
  currentEnemy = enemies[0];
  enemyHp = currentEnemy.hp;

  document.getElementById("story").textContent =
    "Ichido wakes in the forest. The Grand Selection has begun.";

  document.getElementById("message").textContent = "";

  updateScreen();
}

updateScreen();
