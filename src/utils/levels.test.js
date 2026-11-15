import test from "node:test";
import assert from "node:assert/strict";
import { LEVELS, applyRoll } from "./levels.js";

const player = { running_points: 5, total_points: 10 };

test("there are 5 levels with unique ids", () => {
  assert.equal(LEVELS.length, 5);
  assert.equal(new Set(LEVELS.map((l) => l.id)).size, 5);
});

test("a 1 busts on every level", () => {
  for (const level of LEVELS) {
    assert.equal(applyRoll(player, 1, level).busted, true);
  }
});

test("a 2 only busts on levels 3 to 5", () => {
  assert.equal(applyRoll(player, 2, LEVELS[0]).busted, false);
  assert.equal(applyRoll(player, 2, LEVELS[1]).busted, false);
  assert.equal(applyRoll(player, 2, LEVELS[2]).busted, true);
  assert.equal(applyRoll(player, 2, LEVELS[3]).busted, true);
  assert.equal(applyRoll(player, 2, LEVELS[4]).busted, true);
});

test("a safe roll adds to running points only", () => {
  const result = applyRoll(player, 4, LEVELS[0]);
  assert.equal(result.running_points, 9);
  assert.equal(result.total_points, 10);
  assert.equal(result.busted, false);
});

test("a bust clears running points but keeps banked points on levels 1 to 4", () => {
  for (const level of LEVELS.slice(0, 4)) {
    const result = applyRoll(player, 1, level);
    assert.equal(result.running_points, 0);
    assert.equal(result.total_points, 10);
  }
});

test("a bust wipes banked points on level 5", () => {
  const result = applyRoll(player, 1, LEVELS[4]);
  assert.equal(result.running_points, 0);
  assert.equal(result.total_points, 0);
});

test("applyRoll does not change the original player", () => {
  const original = { running_points: 5, total_points: 10 };
  applyRoll(original, 1, LEVELS[4]);
  assert.deepEqual(original, { running_points: 5, total_points: 10 });
});