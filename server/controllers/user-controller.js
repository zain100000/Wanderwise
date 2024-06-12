const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const HttpError = require("../models/http-error");
const profileImageUpload = require("../middleware/file-upload");
const User = require("../models/user-model");
const { v2: cloudinary } = require("cloudinary");

// Signup new user
const signup = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password, bio, location } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      const error = new HttpError("User Already Exists!", 400);
      return next(error);
    }

    if (!req.file) {
      return next(new HttpError("No User Profile Image provided!", 400));
    }

    const profileImageUrl =
      await profileImageUpload.cloudinaryProfileImageUpload(req.file);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      bio,
      location,
      profile_image: profileImageUrl,
    });

    await user.save();

    res.status(201).json({ message: "User Created Successfully!" });
  } catch (err) {
    const error = new HttpError("Error Creating User!", 500);
    return next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new HttpError("Invalid Credentials!", 401);
      return next(error);
    }

    const payload = {
      user: {
        id: user.id,
        email: user.email,
      },
    };

    console.log(payload);

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) {
          console.error("Error in JWT sign:", err.message);
          const error = new HttpError("Error Generating Token!", 500);
          return next(error);
        }
        console.log("JWT generated successfully");
        res.json({ message: "Login Successfully", token });
      }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Error Logging User!", 500);
    return next(error);
  }
};

// Get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({ Users: users });
  } catch (err) {
    const error = new HttpError("No Users Found!", 500);
    return next(error);
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    const error = new HttpError("No Users Found For The Provided Id!", 500);
    return next(error);
  }
};

// Update a user
const updateUser = async (req, res, next) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  try {
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (
      req.headers["content-type"] &&
      req.headers["content-type"].includes("application/json")
    ) {
      // Update user properties individually
      if (req.body.firstname) user.firstname = req.body.firstname;
      if (req.body.lastname) user.lastname = req.body.lastname;
      if (req.body.bio) user.bio = req.body.bio;
      if (req.body.location) user.location = req.body.location;

      if (req.file) {
        if (user.profile_image) {
          const publicId = user.profile_image
            .split("/")
            .slice(-4)
            .join("/")
            .split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }

        const folderPath = "wanderwise/uploads/user_images";

        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: folderPath,
          unique_filename: false,
        });

        user.profile_image = result.secure_url; // Update profile_image field
      }
    } else {
      // Update user properties if content-type is not JSON
      if (req.body.firstname) user.firstname = req.body.firstname;
      if (req.body.lastname) user.lastname = req.body.lastname;
      if (req.body.bio) user.bio = req.body.bio;
      if (req.body.location) user.location = req.body.location;

      if (req.file) {
        if (user.profile_image) {
          const publicId = user.profile_image
            .split("/")
            .slice(-4)
            .join("/")
            .split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }

        const folderPath = "wanderwise/uploads/user_images";

        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: folderPath,
          unique_filename: false,
        });

        user.profile_image = result.secure_url; // Update profile_image field
      }
    }

    await user.save();

    res.status(200).json({ message: "User Updated Successfully." });
  } catch (err) {
    console.error("Error updating User:", err);
    return next(new HttpError("Failed To Update User!", 500));
  }
};

// Reset Password
const resetPassword = async (req, res, next) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new HttpError("User Not Found!", 404);
      return next(error);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password Reset Successfully!" });
  } catch (err) {
    const error = new HttpError("Error Resetting Password!", 500);
    return next(error);
  }
};

// Delete a user
const deleteUser = async (req, res, next) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.profile_image) {
      try {
        const publicId = user.profile_image
          .split("/")
          .slice(-4)
          .join("/")
          .split(".")[0];

        const deletionResult = await cloudinary.uploader.destroy(publicId);
        if (deletionResult.result === "ok") {
        } else {
          console.error(
            `Failed to delete Profile Image from Cloudinary: ${publicId}`
          );
        }
      } catch (err) {
        console.error("Error deleting Profile image from Cloudinary:", err);
      }
    }

    await User.deleteOne({ _id: userId });

    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("Error deleting User:", err.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  signup,
  login,
  getUsers,
  getUserById,
  updateUser,
  resetPassword,
  deleteUser,
};
