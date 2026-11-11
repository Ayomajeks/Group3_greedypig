
import supabase from "../config/supabase.js";
import jwt from "jsonwebtoken";

export const registerGuest = async (req, res) => {
  try {
    const { username } = req.body;

    // 1. Check that a username was provided
    if (!username || typeof username !== "string") {
      return res.status(400).json({
        success: false,
        message: "Username is required.",
      });
    }

    // 2. Remove unnecessary spaces
    const cleanUsername = username.trim();

    // 3. Validate username length
    if (cleanUsername.length < 3 || cleanUsername.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Username must be between 3 and 20 characters.",
      });
    }

    // 4. Only allow letters, numbers, spaces and underscores
    const usernamePattern = /^[a-zA-Z0-9_ ]+$/;

    if (!usernamePattern.test(cleanUsername)) {
      return res.status(400).json({
        success: false,
        message: "Username contains invalid characters.",
      });
    }

    // 5. Create the player in Supabase
    const { data: player, error } = await supabase
      .from("players")
      .insert([{ username: cleanUsername }])
      .select("id, username, created_at")
      .single();

    if (error) {
      // PostgreSQL unique constraint violation
      if (error.code === "23505") {
        return res.status(409).json({
          success: false,
          message: "This username is already taken.",
        });
      }

      throw error;
    }

    // 6. Generate a signed guest session token
    const token = jwt.sign(
      {
        username: player.username,
      },
      process.env.JWT_SECRET,
      {
        subject: player.id,
        expiresIn: "7d",
      }
    );

    // 7. Return the player and token
    return res.status(201).json({
      success: true,
      message: "Guest account created successfully.",
      data: {
        player,
        token,
      },
    });

  } catch (error) {
    console.error("Guest registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create guest account.",
    });
  }
};


export const getCurrentPlayer = async (req, res) => {
  try {
    // Get the verified player's ID from the middleware
    const playerId = req.player.id;

    // Retrieve that player's information from Supabase
    const { data: player, error } = await supabase
      .from("players")
      .select("id, username, created_at")
      .eq("id", playerId)
      .single();

    if (error || !player) {
      return res.status(404).json({
        success: false,
        message: "Player not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Player authenticated successfully.",
      data: {
        player,
      },
    });

  } catch (error) {
    console.error("Get player error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve player information.",
    });
  }
};
