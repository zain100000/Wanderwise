const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  profile_image: {
    type: String,
    required: true,
  },

  firstname: {
    type: String,
    required: true,
  },

  lastname: {
    type: String,
    required: true,
  },

  bio: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  friendlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Friend",
    },
  ],

  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  ],

  resetPasswordToken: { type: String },

  resetPasswordTokenExpiry: { type: Date },
});

const User = new mongoose.model("User", userSchema);
module.exports = User;
