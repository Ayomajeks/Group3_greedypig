
import jwt from "jsonwebtoken";

export const authenticatePlayer = (req, res, next) => {
  try {
    // Get the Authorization header
    const authHeader = req.headers.authorization;

    // Check whether a token was provided
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please provide a token.",
      });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    // Verify the token using our secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the verified player's identity to the request
    req.player = {
      id: decoded.sub,
      username: decoded.username,
    };

    // Allow the request to continue
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
};
