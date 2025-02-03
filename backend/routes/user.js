const express = require("express");
const User = require("../model/user");
const router = express.Router();
const {
  hashedPassword,
  isPasswordMatched,
  getLoginToken,
} = require("../utils/helper");
const authenticateToken = require("../middleware/authMiddleware");

// Sign-up route
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase();

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or username already exists." });
    }

    // Hash password and save new user
    const encryptedPassword = await hashedPassword(password);
    const newUser = new User({
      username,
      email: normalizedEmail,
      password: encryptedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "Account created successfully." });
  } catch (error) {
    console.error("Sign-up error:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Sign-in route
router.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Normalize email and find user
    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Check password
    const isMatch = await isPasswordMatched(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate token
    const token = await getLoginToken(existingUser._id, existingUser.email);

    // Set cookie
    res.cookie("podcasterUserToken", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({
      id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      message: "Sign-in successful.",
    });
  } catch (error) {
    console.error("Sign-in error:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Log-out route
router.post("/log-out", async (req, res) => {
  try {
    res.clearCookie("podcasterUserToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.status(200).json({ message: "Log-out successful." });
  } catch (error) {
    console.error("Log-out error:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Check if cookie is present
router.get("/check-cookie", async (req, res) => {
  try {
    const token = req.cookies.podcasterUserToken;
    res.status(200).json({ message: token ? "true" : "false" });
  } catch (error) {
    console.error("Check-cookie error:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
});

// User details route
router.get("/user-details", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("User-details error:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
