
import supabase from "../config/supabase.js";
import jwt from "jsonwebtoken";

async function getSavedGameResults(gameId) {
  const { data: results, error } = await supabase
    .from("game_results")
    .select("player_id, final_score, placement")
    .eq("game_id", gameId)
    .order("placement", { ascending: true });

  if (error) {
    throw error;
  }

  return results;
}

export const completeGame = async (req, res) => {
  let submissionId;

  try {
    const { participants, submissionId: submittedId } = req.body;
    submissionId = typeof submittedId === "string" ? submittedId.trim() : "";

    if (!submissionId || submissionId.length > 100) {
      return res.status(400).json({
        success: false,
        message: "A game submission ID between 1 and 100 characters is required.",
      });
    }

    // 1. Validate the participants array.
    if (!Array.isArray(participants) || participants.length < 2) {
      return res.status(400).json({
        success: false,
        message: "A game must have at least two participants.",
      });
    }

    // 2. Validate each participant's information.
    const playerIds = [];

    for (const participant of participants) {
      const { playerId, token, finalScore } = participant;

      if (
        !playerId ||
        typeof token !== "string" ||
        !Number.isSafeInteger(finalScore) ||
        finalScore < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid participant information.",
        });
      }

      // Check that the player ID is a valid UUID.
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      if (!uuidPattern.test(playerId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid player ID.",
        });
      }

      // Verify that the token belongs to this player.
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.sub !== playerId) {
          return res.status(401).json({
            success: false,
            message: "Player authentication failed.",
          });
        }
      } catch {
        return res.status(401).json({
          success: false,
          message: "A participant has an invalid or expired token.",
        });
      }

      playerIds.push(playerId);
    }

    // 3. Prevent the same player from appearing twice.
    if (new Set(playerIds).size !== playerIds.length) {
      return res.status(400).json({
        success: false,
        message: "A player cannot participate more than once.",
      });
    }

    // 4. Calculate placements using the submitted scores.
    const rankedParticipants = participants
      .map((participant, index) => ({
        player_id: participant.playerId,
        final_score: participant.finalScore,
        originalIndex: index,
      }))
      .sort(
        (a, b) =>
          b.final_score - a.final_score ||
          a.originalIndex - b.originalIndex
      )
      .map((participant, index) => ({
        player_id: participant.player_id,
        final_score: participant.final_score,
        placement: index + 1,
      }));

    // 5. The highest-scoring participant is the winner.
    const winnerId = rankedParticipants[0].player_id;
    const now = new Date().toISOString();

    // 6. Reuse the first completion for a retried client submission.
    const { data: existingGame, error: existingGameError } = await supabase
      .from("games")
      .select("id")
      .eq("submission_id", submissionId)
      .maybeSingle();

    if (existingGameError) {
      throw existingGameError;
    }

    if (existingGame) {
      const savedResults = await getSavedGameResults(existingGame.id);

      return res.status(200).json({
        success: true,
        message: "Game results were already saved.",
        data: { gameId: existingGame.id, results: savedResults },
      });
    }

    // 7. Create the completed game.
    const { data: game, error: gameError } = await supabase
      .from("games")
      .insert([
        {
          status: "completed",
          winner_id: winnerId,
          submission_id: submissionId,
          started_at: now,
          completed_at: now,
        },
      ])
      .select("id")
      .single();

    if (gameError) {
      throw gameError;
    }

    // 8. Save every participant's result.
    const gameResults = rankedParticipants.map((participant) => ({
      game_id: game.id,
      player_id: participant.player_id,
      final_score: participant.final_score,
      placement: participant.placement,
    }));

    const { error: resultsError } = await supabase
      .from("game_results")
      .insert(gameResults);

    if (resultsError) {
      // Remove the game if saving its results fails.
      // The foreign key cascade removes any associated results.
      const { error: rollbackError } = await supabase
        .from("games")
        .delete()
        .eq("id", game.id);

      if (rollbackError) {
        console.error("Game rollback error:", rollbackError.message);
      }

      throw resultsError;
    }

    // 9. Return the saved game and results.
    return res.status(201).json({
      success: true,
      message: "Game results saved successfully.",
      data: {
        gameId: game.id,
        results: rankedParticipants,
      },
    });
  } catch (error) {
    if (error.code === "23505") {
      try {
        const { data: existingGame } = await supabase
          .from("games")
          .select("id")
          .eq("submission_id", submissionId)
          .maybeSingle();

        if (existingGame) {
          const savedResults = await getSavedGameResults(existingGame.id);

          return res.status(200).json({
            success: true,
            message: "Game results were already saved.",
            data: { gameId: existingGame.id, results: savedResults },
          });
        }
      } catch (duplicateLookupError) {
        console.error(
          "Duplicate game lookup error:",
          duplicateLookupError.message
        );
      }
    }

    console.error("Complete game error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to save game results.",
    });
  }
};
