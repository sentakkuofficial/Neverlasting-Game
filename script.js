let player;
let enemies;
let currentEnemy;
let level;
let gameOver;
let guarding = false;
let observed = false;

function startGame() {
  document.getElementById("introScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
  restartGame();
}

function restartGame() {
  player = {
    hp: 100,
    stamina: 60,
    fear: 20,
    potions: 2
  };

  enemies = [
    {
      name: "Band Hunter",
      hp: 55,
      attack: 11,
      weakness: "defend",
      story: "Level 1: RGB Trial. A contestant watches your red band. He keeps circling, waiting for you to panic.",
      intents: ["Strike", "Heavy Attack", "Feint"]
    },
    {
      name: "Iron-Leg Fighter",
      hp: 80,
      attack: 15,
      weakness: "observe",
      story: "Level 2: Blindtrust. An iron-legged fighter blocks the path. His stance looks strong, but uneven.",
      intents: ["Crushing Kick", "Guard", "Heavy Attack"]
    },
    {
      name: "Vidar's Enforcer",
      hp: 110,
      attack: 19,
      weakness: "power",
      story: "Final Event: Vidar's shadow reaches the arena. His enforcer does not fight fair.",
      intents: ["Terror Strike", "Heavy Attack", "Guard"]
    }
  ];

  level = 0;
  currentEnemy = enemies[level];
  gameOver = false;
  guarding = false;
  observed = false;

  document.getElementById("levelTitle").textContent = "The Grand Selection";
  document.getElementById("message").textContent = "Choose carefully. Every move matters.";
  loadEnemy();
}

function loadEnemy() {
  currentEnemy = enemies[level];
  document.getElementById("story").textContent = currentEnemy.story;
  document.getElementById("levelTitle").textContent = `Level ${level + 1}`;
  currentEnemy.intent = randomIntent();
  updateScreen();
}

function randomIntent() {
  return currentEnemy.intents[Math.floor(Math.random() * currentEnemy.intents.length)];
}

function updateScreen() {
  document.getElementById("playerHp").textContent = player.hp;
  document.getElementById("stamina").textContent = player.stamina;
  document.getElementById("fear").textContent = player.fear;
  document.getElementById("potions").textContent = player.potions;

  document.getElementById("enemyName").textContent = currentEnemy.name;
  document.getElementById("enemyHp").textContent = currentEnemy.hp;
  document.getElementById("enemyIntent").textContent = observed ? currentEnemy.intent : "Unknown";
  document.getElementById("enemyStatus").textContent = observed ? "Studied" : "Unstudied";

  let buttons = document.querySelectorAll(".buttons button");
  buttons.forEach(btn => {
    if (gameOver && btn.textContent !== "Restart") {
      btn.disabled = true;
    } else {
      btn.disabled = false;
    }
  });
}

function chainStrike() {
  if (gameOver) return;

  if (player.stamina < 10) {
    message("Ichido is too exhausted to swing his chain.");
    enemyTurn();
    return;
  }

  player.stamina -= 10;

  let damage = random(12, 20);

  if (currentEnemy.intent === "Feint") {
    damage = Math.floor(damage / 2);
    player.fear += 8;
    message("The enemy baited Ichido. Chain Strike only half-connects.");
  } else {
    message(`Ichido whips his copper chain forward, dealing ${damage} damage.`);
  }

  currentEnemy.hp -= damage;
  afterPlayerMove();
}

function defend() {
  if (gameOver) return;

  guarding = true;
  player.stamina += 12;
  player.fear = Math.max(0, player.fear - 8);

  if (currentEnemy.weakness === "defend") {
    currentEnemy.hp -= 8;
    message("Ichido waits. The Band Hunter overextends. Counter damage dealt.");
  } else {
    message("Ichido raises his chain and steadies his breathing. Stamina restored.");
  }

  afterPlayerMove();
}

function observe() {
  if (gameOver) return;

  observed = true;
  player.stamina += 8;
  player.fear = Math.max(0, player.fear - 5);

  if (currentEnemy.weakness === "observe") {
    currentEnemy.hp -= 12;
    message("Ichido studies the enemy's stance and notices the weak leg. Free damage dealt.");
  } else {
    message("Ichido watches carefully. The enemy's next move is revealed.");
  }

  updateScreen();
}

function powerAttack() {
  if (gameOver) return;

  if (player.stamina < 25) {
    message("Not enough stamina. Ichido's body refuses to move.");
    enemyTurn();
    return;
  }

  player.stamina -= 25;

  let hitChance = observed ? 0.75 : 0.45;

  if (currentEnemy.weakness === "power") {
    hitChance += 0.15;
  }

  if (Math.random() < hitChance) {
    let damage = random(28, 42);
    currentEnemy.hp -= damage;
    player.fear += 5;
    message(`Ichido risks everything and lands a brutal chain slam for ${damage} damage.`);
  } else {
    player.fear += 15;
    message("Ichido misses. The failed attack shakes his confidence.");
  }

  afterPlayerMove();
}

function usePotion() {
  if (gameOver) return;

  if (player.potions <= 0) {
    message("No potions left.");
    return;
  }

  player.potions--;
  player.hp = Math.min(100, player.hp + 30);
  player.fear = Math.max(0, player.fear - 10);

  message("Ichido uses a stolen healing vial. +30 HP. Fear reduced.");
  enemyTurn();
}

function afterPlayerMove() {
  if (currentEnemy.hp <= 0) {
    nextLevel();
  } else {
    enemyTurn();
  }
}

function enemyTurn() {
  if (gameOver) return;

  let damage = 0;
  let text = "";

  if (currentEnemy.intent === "Strike") {
    damage = random(currentEnemy.attack - 3, currentEnemy.attack + 4);
    text = `${currentEnemy.name} strikes quickly.`;
  }

  if (currentEnemy.intent === "Heavy Attack") {
    damage = random(currentEnemy.attack + 6, currentEnemy.attack + 14);
    text = `${currentEnemy.name} goes for a heavy attack.`;
  }

  if (currentEnemy.intent === "Feint") {
    damage = random(5, 9);
    player.fear += 10;
    text = `${currentEnemy.name} feints, raising Ichido's fear.`;
  }

  if (currentEnemy.intent === "Guard") {
    currentEnemy.hp += 8;
    text = `${currentEnemy.name} guards and recovers 8 HP.`;
  }

  if (currentEnemy.intent === "Crushing Kick") {
    damage = random(18, 28);
    text = `${currentEnemy.name} launches a crushing iron kick.`;
  }

  if (currentEnemy.intent === "Terror Strike") {
    damage = random(16, 24);
    player.fear += 15;
    text = `${currentEnemy.name} attacks with terrifying pressure.`;
  }

  if (guarding) {
    damage = Math.floor(damage / 2);
    guarding = false;
  }

  player.hp -= damage;

  if (player.fear >= 70) {
    player.stamina -= 10;
    text += " Fear is overwhelming Ichido. He loses stamina.";
  }

  player.stamina = Math.min(80, Math.max(0, player.stamina + 5));
  currentEnemy.intent = randomIntent();

  document.getElementById("message").textContent += ` ${text} Ichido takes ${damage} damage.`;

  checkGame();
  updateScreen();
}

function nextLevel() {
  level++;

  if (level >= enemies.length) {
    gameOver = true;
    document.getElementById("story").textContent =
      "Ichido survives the Grand Selection. But survival did not feel like victory.";
    document.getElementById("message").textContent =
      "YOU WIN. To be continued in Neverlasting: Bonds.";
    updateScreen();
    return;
  }

  player.hp = Math.min(100, player.hp + 25);
  player.stamina = 60;
  player.fear = Math.max(0, player.fear - 20);
  observed = false;
  guarding = false;

  message("Ichido survives the fight. Memories of Nayuri force him forward. +25 HP.");
  loadEnemy();
}

function checkGame() {
  if (player.hp <= 0 || player.stamina < 0 || player.fear >= 100) {
    gameOver = true;
    player.hp = Math.max(0, player.hp);

    document.getElementById("story").textContent =
      "Ichido collapses. In the Grand Selection, hesitation is death.";

    document.getElementById("message").textContent =
      "GAME OVER. Try again, but think before every move.";
  }
}

function message(text) {
  document.getElementById("message").textContent = text;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
