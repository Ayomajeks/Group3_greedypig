import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/leaderboard`);
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Failed to load leaderboard.");
      }

      setPlayers(Array.isArray(result.data) ? result.data : []);
    } catch (requestError) {
      setError(requestError.message || "Failed to load leaderboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/live-game/setup");
  };

  const podium = [
    { player: players[1], position: "2nd Place", order: "sm:order-1" },
    { player: players[0], position: "1st Place", order: "sm:order-2" },
    { player: players[2], position: "3rd Place", order: "sm:order-3" },
  ].filter((item) => item.player);

  return (
    <section className="min-h-screen w-full px-4 py-8 sm:py-12 text-[#F9F7E8]">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            type="button"
            onClick={goBack}
            className="border border-gray-600 px-4 py-2 rounded hover:bg-[#292929]"
          >
            Back
          </button>
          <button
            type="button"
            onClick={fetchLeaderboard}
            disabled={loading}
            className="border border-gray-600 px-4 py-2 rounded hover:bg-[#292929] disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        <h1 className="pri-font text-3xl md:text-5xl text-center mb-4">
          Leaderboard
        </h1>
        <p className="text-center text-gray-400 mb-10">
          See how you rank against other Greedy Pig players.
        </p>

        {!loading && !error && podium.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {podium.map((item) => (
              <div
                key={item.player.player_id}
                className={`bg-[#1c1c1c] rounded-xl p-6 text-center border border-gray-700 ${item.order}`}
              >
                <p className="text-gray-400 text-sm mb-2">{item.position}</p>
                <h2 className="font-bold text-xl mb-2 break-words">
                  {item.player.username}
                </h2>
                <p className="text-gray-400 text-sm">
                  {item.player.wins} Wins
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-[#1c1c1c] rounded-xl p-3 sm:p-6 overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="p-3">Rank</th>
                <th className="p-3">Player</th>
                <th className="p-3">Wins</th>
                <th className="p-3">Games</th>
                <th className="p-3">Win Rate</th>
                <th className="p-3">Total Score</th>
                <th className="p-3">Best Score</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center p-8 text-gray-400">
                    Loading leaderboard...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="text-center p-8 text-red-400">
                    <p>{error}</p>
                    <button
                      type="button"
                      onClick={fetchLeaderboard}
                      className="underline mt-2"
                    >
                      Try Again
                    </button>
                  </td>
                </tr>
              ) : players.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-8 text-gray-400">
                    No players on the leaderboard yet.
                  </td>
                </tr>
              ) : (
                players.map((player) => (
                  <tr
                    key={player.player_id}
                    className="border-b border-gray-800 hover:bg-[#292929]"
                  >
                    <td className="p-3">{player.rank}</td>
                    <td className="p-3 font-semibold break-words">
                      {player.username}
                    </td>
                    <td className="p-3">{player.wins}</td>
                    <td className="p-3">{player.games_played}</td>
                    <td className="p-3">{player.win_rate}%</td>
                    <td className="p-3">{player.total_score}</td>
                    <td className="p-3">{player.best_score}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
