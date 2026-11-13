import test from "node:test";
import assert from "node:assert/strict";
import {
  TUTORIAL_STEPS,
  advanceTutorial,
  getInitialTutorialState,
} from "./tutorialEngine.js";

test("practice opens directly on the first roll with no points", () => {
  const state = getInitialTutorialState();
  assert.equal(state.stageIndex, 0);
  assert.equal(TUTORIAL_STEPS[0].action, "roll");
  assert.equal(state.turnPoints, 0);
  assert.deepEqual(state.players.map((player) => player.banked), [0, 0]);
});

test("a roll adds to turn points, not banked points", () => {
  const state = advanceTutorial(getInitialTutorialState(), "roll");
  assert.equal(state.lastRoll, 4);
  assert.equal(state.turnPoints, 4);
  assert.equal(state.players[0].banked, 0);
});

test("passing banks 7 and switches to Player 2", () => {
  let state = getInitialTutorialState();
  for (const action of ["roll", "roll", "pass"]) {
    state = advanceTutorial(state, action);
  }
  assert.equal(state.stageIndex, 3);
  assert.equal(state.players[0].banked, 7);
  assert.equal(state.turnPoints, 0);
  assert.equal(state.currentPlayer, 1);
  assert.equal(state.lastAction, "pass");
});

test("rolling 1 loses only unbanked points and ends Player 2's turn", () => {
  let state = getInitialTutorialState();
  for (const action of ["roll", "roll", "pass", "roll", "roll"]) {
    state = advanceTutorial(state, action);
  }
  assert.equal(state.lastRoll, 1);
  assert.equal(state.turnPoints, 0);
  assert.equal(state.currentPlayer, 0);
  assert.deepEqual(state.players.map((player) => player.banked), [7, 0]);
  assert.equal(state.stageIndex, TUTORIAL_STEPS.length - 1);
});

test("wrong actions and actions after completion do nothing", () => {
  const initial = getInitialTutorialState();
  assert.equal(advanceTutorial(initial, "pass"), initial);
  let complete = initial;
  for (const action of ["roll", "roll", "pass", "roll", "roll"]) {
    complete = advanceTutorial(complete, action);
  }
  assert.equal(advanceTutorial(complete, "roll"), complete);
  assert.equal(advanceTutorial(complete, "pass"), complete);
});
