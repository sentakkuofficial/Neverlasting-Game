let state = {
  hp: 100,
  fear: 15,
  trustKyo: 0,
  trustSaara: 0,
  chain: true,
  scene: "intro"
};

const story = document.getElementById("story");
const message = document.getElementById("message");
const levelTitle = document.getElementById("levelTitle");

function startGame() {
  document.getElementById("introScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
  showScene("intro");
}

function updateStats() {
  document.getElementById("playerHp").textContent = state.hp;
  document.getElementById("stamina").textContent = "N/A";
  document.getElementById("fear").textContent = state.fear;
  document.getElementById("potions").textContent = "None";

  document.getElementById("enemyName").textContent = "The Grand Selection";
  document.getElementById("enemyHp").textContent = "???";
  document.getElementById("enemyIntent").textContent = "Unknown";
  document.getElementById("enemyStatus").textContent = "Story Mode";
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

function showScene(scene) {
  state.scene = scene;
  updateStats();

  if (scene === "intro") {
    levelTitle.textContent = "Level 1: RGB Trial";
    story.textContent =
      "Ichido wakes in a forest with a red band around his wrist. The trees are silent. Too silent. Somewhere in the distance, contestants scream. The Grand Selection has begun.";

    message.textContent =
      "You are not here to win glory. You are here to survive.";

    setChoices([
      { text: "Climb a tree and observe", action: () => showScene("tree") },
      { text: "Run toward the gate", action: () => badChoice("Ichido runs without thinking. A hidden contestant strikes from the bushes.", -25, 15, "ambush") },
      { text: "Hide behind the rocks", action: () => showScene("rocks") }
    ]);
  }

  if (scene === "tree") {
    story.textContent =
      "From above, Ichido sees three contestants surrounding a frightened boy. The boy is Kyo. He is shaking, but still holding his band.";

    message.textContent =
      "Kyo is weak alone. But weak people sometimes notice things strong people miss.";

    setChoices([
      { text: "Help Kyo immediately", action: () => goodChoice("Ichido drops from the tree and saves Kyo before the attackers finish him.", 0, -5, "meetKyo", "kyo") },
      { text: "Wait and study the attackers", action: () => showScene("studyAttackers") },
      { text: "Leave Kyo behind", action: () => badChoice("Ichido walks away. Kyo's scream follows him through the forest.", 0, 25, "kyoDies") }
    ]);
  }

  if (scene === "rocks") {
    story.textContent =
      "Ichido hides behind jagged rocks. Nearby, he notices footprints circling the area. Someone is baiting scared contestants into a trap.";

    message.textContent =
      "The surroundings can save you if you pay attention.";

    setChoices([
      { text: "Use rocks to create noise away from you", action: () => goodChoice("Ichido throws stones into the brush. The hunter moves toward the sound, exposing his back.", 0, -5, "counterHunter") },
      { text: "Stay completely still", action: () => badChoice("Ichido waits too long. The hunter finds him anyway.", -15, 10, "ambush") },
      { text: "Sprint out", action: () => badChoice("Ichido sprints into open ground. Bad move.", -20, 10, "ambush") }
    ]);
  }

  if (scene === "studyAttackers") {
    story.textContent =
      "Ichido watches carefully. One attacker is impatient. One keeps checking the gate. One never turns his back to the trees.";

    message.textContent =
      "A direct fight is suicide. But the impatient one can be baited.";

    setChoices([
      { text: "Drop behind the impatient attacker", action: () => goodChoice("Ichido lands silently and wraps his copper chain around the attacker's ankle.", 0, -5, "meetKyo", "kyo") },
      { text: "Challenge all three", action: () => badChoice("Ichido steps out bravely. Bravery is not strategy.", -35, 20, "ambush") },
      { text: "Throw branch toward the gate", action: () => goodChoice("The attackers turn toward the sound. Kyo escapes toward Ichido.", 0, -5, "meetKyo", "kyo") }
    ]);
  }

  if (scene === "meetKyo") {
    story.textContent =
      "Kyo stares at Ichido, breathing hard. He asks, 'Why did you help me?' Ichido does not answer right away. In this tournament, trust can be deadlier than a blade.";

    message.textContent =
      "Kyo may help later depending on how you treat him.";

    setChoices([
      { text: "Tell Kyo: stay behind me", action: () => goodChoice("Kyo nods. For the first time, Ichido is not completely alone.", 0, -5, "saaraIntro", "kyo") },
      { text: "Tell Kyo: I only need your band", action: () => badChoice("Kyo steps back, hurt and afraid. He will remember that.", 0, 10, "saaraIntro") },
      { text: "Say nothing and keep moving", action: () => showScene("saaraIntro") }
    ]);
  }

  if (scene === "kyoDies") {
    story.textContent =
      "Kyo dies in the forest. Ichido survives, but the silence feels heavier now. Some deaths are not game overs. Some deaths become ghosts.";

    message.textContent =
      "Kyo is gone. Future choices will be harder.";

    setChoices([
      { text: "Keep moving", action: () => showScene("saaraIntro") }
    ]);
  }

  if (scene === "counterHunter") {
    story.textContent =
      "Ichido uses the rocks and trees to trap the hunter's movement. One clean chain strike drops him. Ichido takes the band and moves deeper into the trial.";

    message.textContent =
      "Survival is not about strength. It is about seeing the field.";

    setChoices([
      { text: "Continue", action: () => showScene("saaraIntro") }
    ]);
  }

  if (scene === "ambush") {
    story.textContent =
      "Ichido survives the ambush, but his body aches. He realizes the Grand Selection punishes careless movement.";

    message.textContent =
      "HP lost. Fear increased.";

    setChoices([
      { text: "Continue carefully", action: () => showScene("saaraIntro") }
    ]);
  }

  if (scene === "saaraIntro") {
    levelTitle.textContent = "Level 2: Blindtrust";
    story.textContent =
      "The next area is colder. Ichido hears chains dragging across stone. A girl is tied near the center of the arena. Her name is Saara. She looks terrified, but her eyes are sharp.";

    message.textContent =
      "Saara is not just someone to save. She is someone you must understand.";

    setChoices([
      { text: "Rush to untie Saara", action: () => badChoice("Ichido rushes forward. A wire trap cuts across his arm.", -20, 15, "saaraTrap") },
      { text: "Ask Saara what she sees", action: () => goodChoice("Saara whispers: 'The floor. Look at the floor.' Ichido notices the trap lines.", 0, -5, "saaraTrust", "saara") },
      { text: "Ignore Saara and scan the arena", action: () => showScene("arenaScan") }
    ]);
  }

  if (scene === "saaraTrap") {
    story.textContent =
      "Saara looks guilty even though it was not her fault. 'I tried to warn you,' she says. Ichido clenches his teeth and studies the arena again.";

    message.textContent =
      "Pain teaches what panic hides.";

    setChoices([
      { text: "Listen to Saara now", action: () => goodChoice("Ichido finally listens. Saara guides him around the wires.", 0, -5, "saaraTrust", "saara") },
      { text: "Blame her", action: () => badChoice("Saara goes quiet. Trust breaks.", 0, 20, "arenaFight") }
    ]);
  }

  if (scene === "arenaScan") {
    story.textContent =
      "Ichido scans the arena. Dust gathers unnaturally near the center. Thin wires stretch between broken pillars. Saara notices him noticing.";

    message.textContent =
      "You found the trap without rushing.";

    setChoices([
      { text: "Signal Saara to stay still", action: () => goodChoice("Saara understands. She stops moving before triggering the wires.", 0, -5, "saaraTrust", "saara") },
      { text: "Cut all the wires with chain", action: () => badChoice("The chain hits one wire too hard. A blade trap snaps out.", -15, 10, "arenaFight") }
    ]);
  }

  if (scene === "saaraTrust") {
    story.textContent =
      "Saara says, 'I do not need a hero. I need someone who thinks.' Ichido grips his chain. For a moment, they understand each other.";

    message.textContent =
      "Saara's trust increased.";

    setChoices([
      { text: "Use Saara's warning to lure the enemy", action: () => showScene("arenaFightSmart") },
      { text: "Fight the enemy directly", action: () => badChoice("Ichido charges. The enemy wanted that.", -30, 20, "arenaFight") }
    ]);
  }

  if (scene === "arenaFightSmart") {
    story.textContent =
      "The enemy steps from the shadows. Ichido pretends not to see the trap wires. Saara plays along, acting scared. The enemy rushes in and trips the arena trap himself.";

    message.textContent =
      "Smart victory. You used trust and surroundings.";

    setChoices([
      { text: "Free Saara", action: () => showScene("saaraDeath") }
    ]);
  }

  if (scene === "arenaFight") {
    story.textContent =
      "The fight is messy. Ichido wins, but barely. Saara watches him with fear instead of trust.";

    message.textContent =
      "You survived, but survival has a cost.";

    setChoices([
      { text: "Free Saara", action: () => showScene("saaraDeath") }
    ]);
  }

  if (scene === "saaraDeath") {
    levelTitle.textContent = "Inevitable Death";
    story.textContent =
      "Ichido reaches Saara. For one second, it feels like he made the right choice. Then the arena mechanism activates. Saara smiles sadly. 'You were close,' she says.";

    message.textContent =
      "Some deaths are inevitable. The question is not whether Ichido can save everyone. The question is what their deaths do to him.";

    setChoices([
      { text: "Hold Saara's hand until the end", action: () => goodChoice("Ichido stays. Saara does not die alone.", 0, 10, "afterSaara", "saara") },
      { text: "Look away", action: () => badChoice("Ichido looks away, but the sound stays with him.", 0, 25, "afterSaara") },
      { text: "Promise to remember her", action: () => goodChoice("Ichido promises. Saara's death becomes a wound, not a weakness.", 0, 5, "afterSaara", "saara") }
    ]);
  }

  if (scene === "afterSaara") {
    story.textContent =
      "The arena opens. Ichido walks forward carrying Saara's final expression in his mind. If Kyo is alive, he waits ahead, shaken but breathing.";

    message.textContent =
      "Your choices now shape the final encounter.";

    setChoices([
      { text: "Find Kyo", action: () => showScene(state.trustKyo > 0 ? "kyoReturns" : "kyoDistant") },
      { text: "Go alone", action: () => showScene("finalAlone") }
    ]);
  }

  if (scene === "kyoReturns") {
    story.textContent =
      "Kyo returns. He is scared, but he does not run. 'I saw a path near the broken wall,' he says. 'It might help us avoid the main guards.'";

    message.textContent =
      "Because you helped Kyo, you have another option.";

    setChoices([
      { text: "Trust Kyo's path", action: () => showScene("secretPath") },
      { text: "Use Kyo as bait", action: () => badChoice("Kyo realizes what Ichido is doing. His face changes. Trust dies.", 0, 30, "finalAlone") },
      { text: "Tell Kyo to escape alone", action: () => showScene("kyoEscape") }
    ]);
  }

  if (scene === "kyoDistant") {
    story.textContent =
      "Kyo is alive, but distant. He does not trust Ichido enough to help. In the Grand Selection, kindness delayed becomes useless.";

    message.textContent =
      "You lost Kyo's support.";

    setChoices([
      { text: "Continue alone", action: () => showScene("finalAlone") }
    ]);
  }

  if (scene === "secretPath") {
    story.textContent =
      "Kyo leads Ichido through a cracked passage behind the arena. They avoid two guards and reach the final gate. But one enforcer waits there, smiling.";

    message.textContent =
      "Kyo helped you avoid damage. Final encounter begins.";

    setChoices([
      { text: "Use chain on the gate mechanism", action: () => showScene("finalSmart") },
      { text: "Attack the enforcer", action: () => badChoice("The enforcer is stronger. Ichido is thrown into the wall.", -25, 20, "finalFight") },
      { text: "Tell Kyo to distract him", action: () => showScene("kyoSacrifice") }
    ]);
  }

  if (scene === "kyoEscape") {
    story.textContent =
      "Ichido tells Kyo to run. Kyo hesitates, then obeys. Ichido faces the final path alone, but his fear is lighter.";

    message.textContent =
      "Kyo survives because of you.";

    state.fear = Math.max(0, state.fear - 15);

    setChoices([
      { text: "Face the final gate", action: () => showScene("finalAlone") }
    ]);
  }

  if (scene === "kyoSacrifice") {
    story.textContent =
      "Kyo distracts the enforcer. It works, but only for a moment. The enforcer strikes him down. Kyo buys Ichido the opening he needs.";

    message.textContent =
      "Kyo's death was not random. It came from your choice.";

    state.fear += 20;

    setChoices([
      { text: "Use the opening", action: () => showScene("finalSmart") },
      { text: "Run to Kyo", action: () => badChoice("Ichido runs to Kyo and loses the opening.", -20, 20, "finalFight") }
    ]);
  }

  if (scene === "finalAlone") {
    story.textContent =
      "Ichido reaches the final gate alone. The enforcer waits. Without Kyo's path, Ichido is tired. Without Saara's voice, the arena feels colder.";

    message.textContent =
      "You can still survive, but the cost is higher.";

    setChoices([
      { text: "Attack directly", action: () => badChoice("Ichido attacks head-on. The enforcer overpowers him.", -35, 25, "finalFight") },
      { text: "Use broken chains on the floor", action: () => showScene("finalSmart") },
      { text: "Freeze in fear", action: () => gameOver("Ichido hesitates. The enforcer does not.") }
    ]);
  }

  if (scene === "finalFight") {
    story.textContent =
      "The enforcer advances. Ichido's body screams in pain. A direct win is impossible. He needs the surroundings.";

    message.textContent =
      "Think. The room itself is a weapon.";

    setChoices([
      { text: "Wrap chain around pillar and pull", action: () => showScene("finalSmart") },
      { text: "Keep trading blows", action: () => gameOver("Ichido fights with strength alone. Strength alone is not enough.") },
      { text: "Duck behind broken wall", action: () => badChoice("The wall absorbs one strike, but cracks apart.", -10, 5, "finalSmart") }
    ]);
  }

  if (scene === "finalSmart") {
    story.textContent =
      "Ichido wraps his copper chain around the broken gate mechanism. He pulls at the exact moment the enforcer charges. The gate snaps loose and crashes down.";

    message.textContent =
      "Ichido survives because he thought, trusted, observed, and used the world around him.";

    setChoices([
      { text: "End Chapter", action: () => showScene("ending") }
    ]);
  }

  if (scene === "ending") {
    levelTitle.textContent = "Ending";
    story.textContent =
      "Ichido leaves the trial alive. Kyo, Saara, and every scream in the forest follow him in memory. He did not save everyone. Maybe he never could. But he will carry them.";

    message.textContent =
      "YOU SURVIVED — To be continued in Neverlasting: Bonds.";

    setChoices([
      { text: "Restart", action: restartGame }
    ]);
  }

  checkGame();
}

function goodChoice(text, hpChange, fearChange, nextScene, person) {
  state.hp += hpChange;
  state.fear += fearChange;

  if (person === "kyo") state.trustKyo++;
  if (person === "saara") state.trustSaara++;

  message.textContent = text;
  setTimeout(() => showScene(nextScene), 900);
}

function badChoice(text, hpChange, fearChange, nextScene) {
  state.hp += hpChange;
  state.fear += fearChange;

  message.textContent = text;
  setTimeout(() => showScene(nextScene), 1000);
}

function checkGame() {
  updateStats();

  if (state.hp <= 0) {
    gameOver("Ichido's body gives out before he reaches the end.");
  }

  if (state.fear >= 100) {
    gameOver("Ichido is still alive, but his mind breaks under the weight of the trial.");
  }
}

function gameOver(text) {
  levelTitle.textContent = "Game Over";
  story.textContent = text;
  message.textContent = "The Grand Selection does not forgive every mistake.";

  setChoices([
    { text: "Restart", action: restartGame }
  ]);
}

function restartGame() {
  state = {
    hp: 100,
    fear: 15,
    trustKyo: 0,
    trustSaara: 0,
    chain: true,
    scene: "intro"
  };

  showScene("intro");
}
