
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import Confetti from "react-confetti";
import { Link } from "react-router-dom";
import { getRegisteredPlayers } from "src/utils/leaderboardAuth";

const API_URL = "http://localhost:5000";

function GameOver({ playerData, currentPlayer, setIsContinue }) {
  const [leaderBoard, setLeaderBoard] = useState(playerData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const hasSubmitted = useRef(false);
  const submissionId = useRef(playerData[0]?.gameSubmissionId);
  const windowWidth = useRef(window.innerWidth);
  const windowHeight = useRef(window.innerHeight);

  useEffect(() => {
    setIsContinue(false);
  }, [setIsContinue]);

  useEffect(() => {
    const newLeaderBoard = [...playerData].sort(
      (a, b) =>
        b.total_points +
        b.running_points -
        (a.total_points + a.running_points)
    );

    setLeaderBoard(newLeaderBoard);
  }, [playerData, currentPlayer]);

  const submitGameResults = useCallback(async () => {
    if (hasSubmitted.current) return;

    hasSubmitted.current = true;
    setIsSubmitting(true);
    setSubmissionError("");

    try {
      const registeredPlayers = getRegisteredPlayers();

      const participants = playerData.map((player) => {
        const identity = registeredPlayers.find(
          (registeredPlayer) =>
            registeredPlayer.playerId === player.backendPlayerId
        );

        if (!identity) {
          throw new Error(
            `Could not find the registered identity for ${player.name}.`
          );
        }

        const finalScore =
          Number(player.total_points || 0) +
          Number(player.running_points || 0);

        if (!Number.isSafeInteger(finalScore) || finalScore < 0) {
          throw new Error(`Invalid final score for ${player.name}.`);
        }

        return {
          playerId: identity.playerId,
          token: identity.token,
          finalScore,
        };
      });

      const response = await fetch(`${API_URL}/games/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participants,
          submissionId: submissionId.current,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to save game results."
        );
      }

      setIsSaved(true);
    } catch (error) {
      hasSubmitted.current = false;
      setSubmissionError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [playerData]);

  useEffect(() => {
    submitGameResults();
  }, [submitGameResults]);

  return (
    <div className="min-h-screen w-screen absolute bg-[#000000c0] flex justify-center items-center text-white top-0">
      <Confetti
        width={windowWidth.current}
        height={windowHeight.current}
      />

      <section className="grid place-content-center gap-4 w-[400px]">
        <figure className="flex justify-center w-full">
          <img src={leaderBoard[0].avatar} alt="" width={300} />
        </figure>

        <p className="text-center text-5xl pri-font capitalize">
          {leaderBoard[0].name === ""
            ? leaderBoard[0].tag
            : leaderBoard[0].name} wins
        </p>

        <Link
          to="/live-game/setup"
          className="text-center sec-font text-xl rounded px-8 py-4 bg-[#d30cbcc0] font-bold duration-500 skew-x-6 hover:skew-x-0 hover:scale-95 hover:bg-[#d30cbc]"
        >
          Play Again
        </Link>

        <Link
          to="/"
          className="text-center sec-font text-xl rounded px-8 py-4 bg-[#d30cbcc0] font-bold duration-500 -skew-x-6 hover:skew-x-0 hover:scale-95 hover:bg-[#d30cbc]"
        >
          Home
        </Link>

        <a
          href="https://forms.gle/skt5UKYGbDVzu2EL9"
          className="text-[#ffffff] underline text-center hover:text-[#d30cbc]"
          target="_blank"
          rel="noreferrer"
        >
          feedback
        </a>
      </section>
    </div>
  );
}

export default GameOver;
