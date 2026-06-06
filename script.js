let state = {};

function startGame() {
  document.getElementById("introScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
  restartGame();
}

function restartGame() {
  state = {
    hp: 100,
    hunger: 70,
    fear: 20,
    food: 1,
    survivors: 600,
    level: 1,
    kyoAlive: true,
    kyoTrust: 0,
    saaraTrust: 0
  };

  showLevel1();
}

function updateStats() {
  document.getElementById("playerHp").textContent = state.hp;
  document.getElementById("fear").textContent = state.fear;
  document.getElementById("stamina").textContent = state.hunger;
  document.getElementById("potions").textContent = state.food;

  document.getElementById("enemyName").textContent = "Survivors Left";
  document.getElementById("enemyHp").textContent = state.survivors;
  document.getElementById("enemyIntent").textContent = `Level ${state.level}`;
  document.getElementById("enemyStatus").textContent = "Grand Selection";
}

function setText(title, storyText, msg) {
  document.getElementById("levelTitle").textContent = title;
  document.getElementById("story").textContent = storyText;
  document.getElementById("message").textContent = msg;
  updateStats();
  checkDeath();
}

function setChoices(choices) {
  const buttons = document.querySelector(".buttons");
  buttons.innerHTML = "";

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.onclick = choice.action;
    buttons.appendChild(btn);
  });
}

function change(hp, hunger, fear, survivors) {
  state.hp += hp;
  state.hunger += hunger;
  state.fear += fear;
  state.survivors -= survivors;

  if (state.hunger > 100) state.hunger = 100;
  if (state.fear < 0) state.fear = 0;
}

function eatFood(nextScene) {
  if (state.food <= 0) {
    document.getElementById("message").textContent = "Ichido reaches for food, but he has none.";
    return;
  }

  state.food--;
  change(10, 30, -8, 0);
  document.getElementById("message").textContent = "Ichido eats quietly. It is not comfort. It is survival.";
  updateStats();

  setTimeout(nextScene, 900);
}

function checkDeath() {
  updateStats();

  if (state.hp <= 0) {
    gameOver("Ichido's body gives out. The Grand Selection does not pause for the weak.");
  }

  if (state.hunger <= 0) {
    gameOver("Ichido collapses from hunger. Survival was not only about fighting.");
  }

  if (state.fear >= 100) {
    gameOver("Ichido is alive, but his mind breaks. He cannot move forward.");
  }
}

function gameOver(text) {
  setText("GAME OVER", text, "Restart and think like Ichido would.");
  setChoices([{ text: "Restart", action: restartGame }]);
}

/* LEVEL 1 */

function showLevel1() {
  state.level = 1;
  setText(
    "Level 1: RGB Trial",
    "600 contestants wake across the forest. Ichido opens his eyes with a red band around his wrist. Screams spread between the trees. Everyone needs a matching band. Everyone is prey.",
    "Goal: survive Level 1. Think before moving."
  );

  setChoices([
    { text: "Climb a tree and observe", action: level1Tree },
    { text: "Run toward the gate", action: () => { change(-30, -15, 20, 80); level1Ambush(); } },
    { text: "Search for food first", action: level1Food }
  ]);
}

function level1Food() {
  change(0, -10, 5, 40);
  state.food++;

  setText(
    "Level 1: Forest Supplies",
    "Ichido searches the roots and finds a wrapped piece of stale bread beside a fallen contestant. He hates himself for taking it, but hunger does not care about pride.",
    "Food gained. But time passed. Contestants died."
  );

  setChoices([
    { text: "Eat now", action: () => eatFood(level1Tree) },
    { text: "Save it for later", action: level1Tree }
  ]);
}

function level1Tree() {
  setText(
    "Level 1: Above the Blood",
    "From the tree, Ichido sees three contestants surrounding Kyo. Kyo is shaking, but still alive. One attacker watches the gate. One is impatient. One keeps checking the trees.",
    "This is not a fair fight."
  );

  setChoices([
    { text: "Drop onto the impatient attacker", action: () => { state.kyoTrust++; change(0, -10, -5, 90); meetKyo(); } },
    { text: "Throw a branch toward the gate", action: () => { state.kyoTrust++; change(0, -5, -3, 75); meetKyo(); } },
    { text: "Leave Kyo behind", action: () => { state.kyoAlive = false; change(0, -5, 25, 100); kyoDiesEarly(); } }
  ]);
}

function level1Ambush() {
  setText(
    "Level 1: Ambush",
    "Ichido runs too openly. A contestant slams him into the dirt and reaches for his band. Ichido survives only by wrapping his chain around a root and pulling himself free.",
    "Bad movement costs HP."
  );

  setChoices([
    { text: "Hide and observe now", action: level1Tree },
    { text: "Keep rushing", action: () => gameOver("Ichido rushes again. This time, three contestants close in. He never reaches the gate.") }
  ]);
}

function meetKyo() {
  setText(
    "Level 1: Kyo",
    "Kyo stares at Ichido like he cannot understand why anyone helped him. 'Why?' he asks. Ichido looks at the blood on the leaves and says nothing.",
    "Kyo may become useful later."
  );

  setChoices([
    { text: "Tell Kyo to stay close", action: () => { state.kyoTrust++; level1Gate(); } },
    { text: "Tell Kyo he owes you", action: () => { state.kyoTrust--; state.fear += 5; level1Gate(); } },
    { text: "Share food with Kyo", action: () => {
      if (state.food > 0) {
        state.food--;
        state.kyoTrust += 2;
        change(0, -5, -10, 0);
      }
      level1Gate();
    }}
  ]);
}

function kyoDiesEarly() {
  setText(
    "Level 1: Kyo's Scream",
    "Ichido leaves. Kyo screams behind him. The scream stops too quickly. Ichido keeps walking, but something follows him now.",
    "Kyo is dead. Some choices do not give second chances."
  );

  setChoices([{ text: "Reach the gate alone", action: level1Gate }]);
}

function level1Gate() {
  state.survivors = Math.min(state.survivors, 320);

  setText(
    "Level 1 Cleared",
    "The first gate opens. Bodies cover the forest behind Ichido. 600 entered. Far fewer remain.",
    "Ichido survives Level 1."
  );

  setChoices([{ text: "Continue to Level 2", action: showLevel2 }]);
}

/* LEVEL 2 */

function showLevel2() {
  state.level = 2;
  state.survivors = 320;

  setText(
    "Level 2: Blindtrust",
    "Ichido enters a stone arena. Saara is chained near the center. Thin wires cross the floor. She whispers, 'Do not rush.'",
    "Goal: survive the trap arena."
  );

  setChoices([
    { text: "Ask Saara what she sees", action: () => { state.saaraTrust++; change(0, -5, -5, 50); saaraTrust(); } },
    { text: "Rush to untie Saara", action: () => { change(-25, -10, 20, 60); saaraTrap(); } },
    { text: "Use dust to reveal the wires", action: () => { state.saaraTrust++; change(0, -8, -5, 45); saaraTrust(); } }
  ]);
}

function saaraTrap() {
  setText(
    "Level 2: Wire Trap",
    "Ichido rushes forward. A wire snaps across his arm. Blood drips onto the stone. Saara shuts her eyes. 'I tried to warn you.'",
    "Panic almost killed you."
  );

  setChoices([
    { text: "Apologize and listen", action: () => { state.saaraTrust++; saaraTrust(); } },
    { text: "Blame Saara", action: () => { state.saaraTrust--; change(0, 0, 20, 0); level2Enemy(); } }
  ]);
}

function saaraTrust() {
  setText(
    "Level 2: Saara",
    "Saara studies the arena while Ichido studies her voice. She is afraid, but not helpless. 'Use the floor,' she says. 'Make him step where you won't.'",
    "Trust creates strategy."
  );

  setChoices([
    { text: "Lure the enemy into the wires", action: () => { change(0, -10, -5, 90); saaraDeath(); } },
    { text: "Use chain around a pillar", action: () => { change(0, -15, 0, 80); saaraDeath(); } },
    { text: "Fight directly", action: () => { change(-35, -20, 25, 70); level2Enemy(); } }
  ]);
}

function level2Enemy() {
  setText(
    "Level 2: Brutal Fight",
    "Ichido wins, but only after being thrown across the arena. His chain feels heavier. Saara watches him with sadness.",
    "You survived badly."
  );

  setChoices([{ text: "Free Saara", action: saaraDeath }]);
}

function saaraDeath() {
  state.survivors = 180;

  setText(
    "Level 2: Inevitable Death",
    "Ichido reaches Saara. For one second, it feels like he saved her. Then the arena mechanism activates. Saara smiles weakly. 'You were close.'",
    "Saara cannot be saved. But Ichido can choose how to carry it."
  );

  setChoices([
    { text: "Stay with Saara until the end", action: () => { change(0, -5, 10, 0); showLevel3(); } },
    { text: "Promise to remember her", action: () => { change(0, -5, 5, 0); showLevel3(); } },
    { text: "Look away", action: () => { change(0, 0, 25, 0); showLevel3(); } }
  ]);
}

/* LEVEL 3 */

function showLevel3() {
  state.level = 3;

  setText(
    "Level 3: Hunger Maze",
    "The next level is not a fight. It is worse. A maze of ruined halls, locked food crates, dirty water, and contestants too hungry to think.",
    "Goal: survive hunger."
  );

  setChoices([
    { text: "Eat your food", action: () => eatFood(level3Choice) },
    { text: "Search crates quietly", action: () => { state.food++; change(0, -15, 5, 40); level3Choice(); } },
    { text: "Steal from a sleeping contestant", action: () => { state.food += 2; change(0, -10, 20, 70); level3Choice(); } }
  ]);
}

function level3Choice() {
  state.survivors = 95;

  setText(
    "Level 3: Starving Survivors",
    "A boy begs Ichido for food. His lips are cracked. His hands shake. Ichido thinks of Nayuri. He thinks of Saara. He thinks of himself.",
    "Food is life here."
  );

  setChoices([
    { text: "Share a small piece", action: () => {
      if (state.food > 0) {
        state.food--;
        change(0, -5, -5, 0);
      } else {
        change(0, -10, 10, 0);
      }
      showLevel4();
    }},
    { text: "Keep everything", action: () => { change(0, 0, 15, 0); showLevel4(); } },
    { text: "Trade food for a route", action: () => {
      if (state.food > 0) {
        state.food--;
        change(0, -5, -10, 0);
      }
      showLevel4();
    }}
  ]);
}

/* LEVEL 4 */

function showLevel4() {
  state.level = 4;
  state.survivors = 60;

  setText(
    "Level 4: The Betrayal Field",
    "Only 60 remain. The arena is open, with broken walls, hanging chains, and mud pits. Kyo appears again if he survived. His face asks one question: can I trust you?",
    "Goal: reach the final 30."
  );

  let choices = [
    { text: "Use broken walls as cover", action: () => { change(0, -10, -5, 20); showLevel5(); } },
    { text: "Cross the open field", action: () => { change(-40, -20, 30, 25); showLevel5(); } }
  ];

  if (state.kyoAlive) {
    choices.push({
      text: "Work with Kyo",
      action: () => {
        if (state.kyoTrust > 0) {
          change(0, -10, -15, 30);
        } else {
          change(-20, -10, 20, 20);
        }
        showLevel5();
      }
    });
  }

  setChoices(choices);
}

/* LEVEL 5 */

function showLevel5() {
  state.level = 5;
  state.survivors = 30;

  setText(
    "Level 5: Final Fifteen",
    "30 contestants remain. Only 15 can pass. The final gate opens for the ones willing to think, betray, endure, or bleed. Ichido's stomach twists. His chain drags across the ground.",
    "Goal: become one of the final 15."
  );

  setChoices([
    { text: "Use the hanging chains to collapse the bridge", action: finalSmart },
    { text: "Fight everyone head-on", action: () => gameOver("Ichido fights like strength alone matters. It does not. He is swallowed by the final riot.") },
    { text: "Hide until the last moment", action: finalHide },
    { text: "Eat before the final push", action: () => eatFood(showLevel5) }
  ]);
}

function finalSmart() {
  state.survivors = 15;
  change(0, -20, 10, 0);

  setText(
    "Victory: One of Fifteen",
    "Ichido wraps his copper chain around the hanging supports and pulls when the crowd rushes forward. The bridge snaps. Contestants fall. The gate counts the survivors.",
    "15 remain. Ichido is one of them."
  );

  setChoices([{ text: "Ending", action: ending }]);
}

function finalHide() {
  change(-10, -25, 20, 10);

  if (state.hunger <= 20) {
    gameOver("Ichido hides too long. Hunger steals his strength before the gate opens.");
    return;
  }

  state.survivors = 15;

  setText(
    "Victory: Barely Alive",
    "Ichido waits in the mud beneath broken stone. When the final screams fade, he crawls out and crosses the gate with shaking legs.",
    "15 remain. Ichido survives, but barely."
  );

  setChoices([{ text: "Ending", action: ending }]);
}

function ending() {
  setText(
    "Ending",
    "600 entered Level 1. Only 15 survived Level 5. Ichido stands among them, starving, wounded, and changed. Saara's final smile follows him. Kyo's fate follows him. Every choice follows him.",
    "YOU SURVIVED — To be continued in Neverlasting: Bonds."
  );

  setChoices([{ text: "Restart", action: restartGame }]);
}
