const jwt = require("jsonwebtoken");

// Authentication checking Alfi
const protect = (req, res, next) => {
  let token = req.headers.authorization;

  // Check if token exists
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  // Remove "Bearer " prefix if present
  if (token.startsWith("Bearer ")) token = token.slice(7, token.length);

  try {
    // Verify token signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    // Distinguish between different token errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired", error: "SESSION_TIMEOUT" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token signature", error: "INVALID_TOKEN" });
    } else {
      return res.status(401).json({ message: "Token is not valid", error: "AUTH_ERROR" });
    }
  }
};

module.exports = protect;

// Its job is to protect routes so only users with a valid JWT can access them.
// Handles token expiration, invalid signatures, and missing tokens.