import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCheck, FiRefreshCw } from "react-icons/fi";
import pigLogo from "src/assets/pig-0.png";
import dice1 from "src/assets/dice_1.png";
import dice2 from "src/assets/dice_2.png";
import dice3 from "src/assets/dice_3.png";
import dice4 from "src/assets/dice_4.png";
import dice5 from "src/assets/dice_5.png";
import dice6 from "src/assets/dice_6.png";
import {
  TUTORIAL_STEPS,
  advanceTutorial,
  getInitialTutorialState,
} from "src/utils/tutorialEngine";

const DICE_IMAGES = [dice1, dice2, dice3, dice4, dice5, dice6];
const TOTAL_ACTIONS = TUTORIAL_STEPS.length - 1;

export default function Tutorial() {
  const [tutorial, setTutorial] = useState(getInitialTutorialState);
  const step = TUTORIAL_STEPS[tutorial.stageIndex];
  const complete = step.action === null;
  const completed = Math.min(tutorial.stageIndex, TOTAL_ACTIONS);

  function nextAction() {
    // Prevent rapid clicks from advancing multiple steps before React rerenders.
    const expectedStage = tutorial.stageIndex;
    setTutorial((previous) =>
      previous.stageIndex === expectedStage
        ? advanceTutorial(previous, step.action)
        : previous
    );
  }

  function restart() {
    setTutorial(getInitialTutorialState());
  }

  return (
    <main className="relative flex min-h-screen w-full min-w-0 items-center justify-center overflow-x-hidden px-3 py-5 text-[#F9F7E8] sm:px-6 sm:py-10 lg:px-10">
      <div className="w-full min-w-0 max-w-5xl">
        <header className="mb-4 flex min-w-0 items-center justify-between gap-3 sm:mb-6">
          <Link
            to="/"
            className="inline-flex min-w-0 items-center gap-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f9a8eb]"
          >
            <img src={pigLogo} alt="" className="h-9 w-9 shrink-0 object-contain sm:h-11 sm:w-11" />
            <span className="pri-font truncate text-base sm:text-xl">Greedy Pig</span>
          </Link>
          <Link
            to="/"
            className="shrink-0 rounded-lg border border-white/30 px-3 py-2 text-sm font-semibold transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            Exit tutorial
          </Link>
        </header>

        <section
          aria-labelledby="tutorial-title"
          className="w-full min-w-0 overflow-hidden rounded-2xl border border-white/20 bg-[#1b1723]/95 shadow-2xl sm:rounded-3xl"
        >
          <div className="border-b border-white/10 px-4 pb-4 pt-5 sm:px-7 sm:pb-6 sm:pt-7 lg:px-9">
            <div className="mb-3 flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-wider">
              <span className="text-[#f6a3e7]">Practice round</span>
              <span className="shrink-0 text-white/65">
                {complete ? "Complete" : `Step ${completed + 1} of ${TOTAL_ACTIONS}`}
              </span>
            </div>
            <div
              role="progressbar"
              aria-label="Practice progress"
              aria-valuemin={0}
              aria-valuemax={TOTAL_ACTIONS}
              aria-valuenow={completed}
              className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-white/15"
            >
              <div
                className="h-full rounded-full bg-[#D30CBD] motion-safe:transition-all motion-safe:duration-200"
                style={{ width: `${(completed / TOTAL_ACTIONS) * 100}%` }}
              />
            </div>
            <h1 id="tutorial-title" className="text-xl font-extrabold leading-tight sm:text-2xl lg:text-3xl">
              {step.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
              {step.description}
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-3 p-3 sm:gap-4 sm:p-6 md:grid-cols-[minmax(0,1.15fr)_minmax(230px,0.85fr)] md:items-stretch lg:gap-6 lg:p-8">
            <div className="flex min-w-0 flex-col justify-between rounded-xl border border-[#056FA4]/50 bg-[#056FA4]/10 p-4 sm:p-5 lg:p-7">
              <div className="flex min-w-0 flex-col items-center gap-4 text-center sm:flex-row sm:text-left md:flex-col md:text-center lg:flex-row lg:text-left">
                <div className="grid h-24 w-24 shrink-0 place-items-center rounded-xl bg-white/10 sm:h-28 sm:w-28 lg:h-32 lg:w-32">
                  {tutorial.lastRoll !== null ? (
                    <img
                      src={DICE_IMAGES[tutorial.lastRoll - 1]}
                      alt={`Die showing ${tutorial.lastRoll}`}
                      className="h-20 w-20 object-contain sm:h-24 sm:w-24 lg:h-28 lg:w-28"
                    />
                  ) : tutorial.lastAction === "pass" ? (
                    <FiCheck aria-label="Points saved" className="h-12 w-12 text-[#9de8c6]" />
                  ) : (
                    <span aria-label="Die not rolled yet" className="text-5xl font-extrabold text-white/60">?</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wide text-white/60">Practice die</p>
                  <p role="status" aria-live="polite" aria-atomic="true" className="mt-2 break-words text-base font-bold leading-6 sm:text-lg">
                    {tutorial.feedback || "Ready to roll"}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex min-w-0 flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
                {complete ? (
                  <Link
                    to="/live-game/setup"
                    className="inline-flex min-h-[48px] min-w-0 flex-1 items-center justify-center gap-2 rounded-lg bg-[#D30CBD] px-4 py-3 text-center text-sm font-extrabold transition-colors hover:bg-[#e31bce] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 sm:text-base"
                  >
                    Play for real <FiArrowRight aria-hidden="true" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={nextAction}
                    className="inline-flex min-h-[48px] min-w-0 flex-1 items-center justify-center gap-2 rounded-lg bg-[#D30CBD] px-4 py-3 text-sm font-extrabold transition-colors hover:bg-[#e31bce] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 sm:text-base"
                  >
                    {step.action === "pass" ? "PASS · Save points" : "ROLL DIE"}
                    <FiArrowRight aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={restart}
                  className="inline-flex min-h-[44px] min-w-0 items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  <FiRefreshCw aria-hidden="true" /> {complete ? "Replay" : "Restart"}
                </button>
              </div>
            </div>

            <div aria-label="Practice scoreboard" className="grid min-w-0 grid-cols-3 gap-2 md:grid-cols-2 md:content-start md:gap-3">
              {tutorial.players.map((player, index) => (
                <div
                  key={player.name}
                  className={`min-w-0 rounded-xl border p-3 text-center sm:p-4 ${
                    tutorial.currentPlayer === index && !complete
                      ? "border-[#D30CBD] bg-[#D30CBD]/10"
                      : "border-white/15 bg-white/5"
                  }`}
                >
                  <p className="text-xs font-semibold text-white/75">{player.name}</p>
                  <p className="mt-1 text-2xl font-extrabold tabular-nums sm:text-3xl lg:text-4xl">{player.banked}</p>
                  <p className="mt-1 text-[11px] text-white/60">Banked</p>
                </div>
              ))}
              <div className="min-w-0 rounded-xl border border-[#056FA4]/60 bg-[#056FA4]/20 p-3 text-center sm:p-4 md:col-span-2">
                <p className="text-xs font-semibold text-white/75">This turn</p>
                <p className="mt-1 text-2xl font-extrabold tabular-nums sm:text-3xl lg:text-4xl">{tutorial.turnPoints}</p>
                <p className="mt-1 text-[11px] text-white/60">Unbanked</p>
              </div>
            </div>
          </div>
          <p className="border-t border-white/10 px-4 py-3 text-center text-xs leading-5 text-white/50 sm:px-7">
            Practice only · Real game scores are unchanged.
          </p>
        </section>
      </div>
    </main>
  );
}
