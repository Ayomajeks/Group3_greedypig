/**
 * A five-action practice round. The die values are intentionally fixed so
 * everyone learns the same rules. Real matches use their own game logic.
 */
export const TUTORIAL_STEPS = [
  {
    id: "first-roll",
    title: "Roll to earn points",
    description: "Roll a 2–6 to add points to your turn.",
    action: "roll",
    rollValue: 4,
  },
  {
    id: "roll-again",
    title: "Keep rolling?",
    description: "Another roll could earn more—but it’s risky.",
    action: "roll",
    rollValue: 3,
  },
  {
    id: "bank-points",
    title: "Save your points",
    description: "PASS banks your turn points and ends your turn.",
    action: "pass",
  },
  {
    id: "next-player",
    title: "Player 2's turn",
    description: "Turns switch after someone PASSES or rolls a 1.",
    action: "roll",
    rollValue: 5,
  },
  {
    id: "roll-one",
    title: "What if you roll a 1?",
    description: "A 1 ends the turn and loses the points earned during it.",
    action: "roll",
    rollValue: 1,
  },
  {
    id: "complete",
    title: "You're ready to play!",
    description: "Reach the target score first to win.",
    action: null,
  },
];

export function getInitialTutorialState() {
  return {
    stageIndex: 0,
    players: [
      { name: "Player 1", banked: 0 },
      { name: "Player 2", banked: 0 },
    ],
    currentPlayer: 0,
    turnPoints: 0,
    lastRoll: null,
    lastAction: null,
    feedback: "",
  };
}

export function advanceTutorial(state, action) {
  const step = TUTORIAL_STEPS[state.stageIndex];
  if (!step || step.action === null || step.action !== action) return state;

  if (action === "pass") {
    const saved = state.turnPoints;
    const players = state.players.map((player, index) =>
      index === state.currentPlayer
        ? { ...player, banked: player.banked + saved }
        : { ...player }
    );

    return {
      ...state,
      players,
      currentPlayer: (state.currentPlayer + 1) % players.length,
      turnPoints: 0,
      lastRoll: null,
      lastAction: "pass",
      stageIndex: state.stageIndex + 1,
      feedback: `${saved} points saved!`,
    };
  }

  if (action === "roll") {
    const value = step.rollValue;
    const lostTurn = value === 1;
    const lostPoints = state.turnPoints;

    return {
      ...state,
      stageIndex: state.stageIndex + 1,
      turnPoints: lostTurn ? 0 : state.turnPoints + value,
      currentPlayer: lostTurn
        ? (state.currentPlayer + 1) % state.players.length
        : state.currentPlayer,
      lastRoll: value,
      lastAction: "roll",
      feedback: lostTurn
        ? `Rolled a 1: ${lostPoints} turn points lost.`
        : `Rolled ${value}: +${value} turn points.`,
    };
  }

  return state;
}
