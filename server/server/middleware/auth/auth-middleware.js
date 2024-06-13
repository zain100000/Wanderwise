const jwt = require("jsonwebtoken");
const User = require("../../models/user-model");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid or missing token" });
  }

  const jwtToken = authHeader.replace("Bearer ", "").trim();

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET);

    let userData;
    if (isVerified.user) {
      userData = await User.findById(isVerified.user.id).select("-password");
    } else {
      throw new Error("Invalid User in JWT Token");
    }

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    req.token = jwtToken;
    req.user = userData;
    req.userId = isVerified.user ? userData._id : null;
    req.userType = isVerified.user;
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message || error);
    res.status(401).json({ message: "Unauthorized token" });
  }
};

module.exports = authMiddleware;
