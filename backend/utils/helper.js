const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const hashedPassword = async (password) => {
  try {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

const isPasswordMatched = async (password, hashPassword) => {
  try {
    return await bcrypt.compare(password, hashPassword);
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

const getLoginToken = async (_id, email) => {
  try {
    const loginToken = await jwt.sign(
      { id: _id, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || "1d" }
    );
    return loginToken;
  } catch (error) {
    throw new Error("Error generating login token");
  }
};

const verifyToken = async (token) => {
  try {
    return await jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

module.exports = {
  hashedPassword,
  isPasswordMatched,
  getLoginToken,
  verifyToken,
};
