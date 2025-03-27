const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// auth
exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        sucess: false,
        message: "Token is missing",
      });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
    } catch (error) {
      return res.status(401).json({
        sucess: false,
        message: "Token is Invalid",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      sucess: false,
      message: "Something went wrong while validating the token",
    });
  }
};

// isStudent
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        sucess: false,
        message: "Protected route for students only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "User role can not be verified",
    });
  }
};

// isInstructor
exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        sucess: false,
        message: "Protected route for instructors only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "User role can not be verified",
    });
  }
};

// isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        sucess: false,
        message: "Protected route for admin only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "User role can not be verified",
    });
  }
};
