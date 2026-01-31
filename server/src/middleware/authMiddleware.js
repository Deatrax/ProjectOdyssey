const jwt = require("jsonwebtoken");

// Authentication checking Alfi
const protect = (req, res, next) => {
  let token = req.headers.authorization;

  // Check if token exists
  if (!token) {
    console.log("❌ No token in Authorization header");
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Remove "Bearer " prefix if present
  if (token.startsWith("Bearer ")) token = token.slice(7, token.length);

  try {
    // Verify token signature and expiration
    console.log("🔐 Verifying token with JWT_SECRET...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified successfully:", decoded);
    req.user = decoded; 
    next();
  } catch (err) {
    // Distinguish between different token errors
    console.log("❌ Token verification failed:", err.message);
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