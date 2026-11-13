
import supabase from "../config/supabase.js";

// GET /leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    // Get the requested limit, defaulting to 50
    const requestedLimit = req.query.limit || "50";

    // Validate the limit
    if (!/^\d+$/.test(requestedLimit)) {
      return res.status(400).json({
        success: false,
        message: "Limit must be a positive number.",
      });
    }

    const limit = Number(requestedLimit);

    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 100.",
      });
    }

    // Retrieve leaderboard statistics
    const { data: leaderboard, error } = await supabase
      .from("leaderboard_stats")
      .select("*")
      .order("rank", { ascending: true })
      .limit(limit);

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard,
    });

  } catch (error) {
    console.error("Leaderboard error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve leaderboard.",
    });
  }
};


// GET /leaderboard/:playerId
export const getPlayerStats = async (req, res) => {
  try {
    const { playerId } = req.params;

    // Validate UUID format
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidPattern.test(playerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid player ID.",
      });
    }

    // Retrieve the player's statistics
    const { data: player, error } = await supabase
      .from("leaderboard_stats")
      .select("*")
      .eq("player_id", playerId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: player,
    });

  } catch (error) {
    console.error("Player statistics error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve player statistics.",
    });
  }
};
