const User = require("../models/UserManagmentModel");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Read token from Authorization header
const getProfile = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res
      .status(401)
      .json({ status: "error", message: "No token provided" });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.sub; // Use 'sub' field from JWT payload

    const user = await User.findById(userId); // Exclude sensitive fields

    if (user) {
      res.status(200).json({ status: "ok", user });
    } else {
      res.status(404).json({ status: "error", message: "User not found" });
    }
  } catch (error) {
    console.error("Profile error:", error.message);
    res
      .status(401)
      .json({ status: "error", message: "Invalid or expired token" });
  }
};

const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (user) {
      res.status(200).json({ status: "ok", user });
    } else {
      res.status(404).json({ status: "error", message: "User not found" });
    }
  } catch (error) {
    console.error("Get user by ID error:", error.message);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

const updateProfile = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res
      .status(401)
      .json({ status: "error", message: "No token provided" });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.sub; // Use 'sub' field from JWT payload
    const updateData = req.body;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (user) {
      res.status(200).json({ status: "ok", user });
    } else {
      res.status(404).json({ status: "error", message: "User not found" });
    }
  } catch (error) {
    console.error("Update profile error:", error.message);
    res
      .status(401)
      .json({ status: "error", message: "Invalid or expired token" });
  }
};

const updateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (user) {
      res.status(200).json({ status: "ok", user });
    } else {
      res.status(404).json({ status: "error", message: "User not found" });
    }
  } catch (error) {
    console.error("Update user error:", error.message);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

exports.getProfile = getProfile;
exports.getUserById = getUserById;
exports.updateProfile = updateProfile;
exports.updateUserById = updateUserById;
