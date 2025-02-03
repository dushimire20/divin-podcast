const jwt = require("jsonwebtoken");
const User = require("../model/user");
const { verifyToken } = require("../utils/helper");

const authenticateToken = async (req, res, next) => {
  // Retrieve token from cookies or headers
  const token = req.cookies.podcasterUserToken || req.header("Authorization")?.replace("Bearer ", "");

  try {
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = await verifyToken(token);

    // Fetch user from database
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = authenticateToken;
