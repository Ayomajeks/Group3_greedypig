export const LEVELS = [
  { id: 1, name: "Piglet",    target: 50,  bustNumbers: [1],    bustLosesBanked: false },
  { id: 2, name: "Farm Hand", target: 100, bustNumbers: [1],    bustLosesBanked: false },
  { id: 3, name: "Hog Boss",  target: 100, bustNumbers: [1, 2], bustLosesBanked: false },
  { id: 4, name: "Greedy",    target: 150, bustNumbers: [1, 2], bustLosesBanked: false },
  { id: 5, name: "Legend",    target: 100, bustNumbers: [1, 2], bustLosesBanked: true },
];

export function applyRoll(player, roll, level) {
  if (level.bustNumbers.includes(roll)) {
    return {
      ...player,
      running_points: 0,
      total_points: level.bustLosesBanked ? 0 : player.total_points,
      busted: true,
    };
  }
  return { ...player, running_points: player.running_points + roll, busted: false };
}