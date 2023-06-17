const mongoose = require("mongoose");

const usernameMaxLength = 20;

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "must provide a username"],
      maxlength: [
        usernameMaxLength,
        `username can not be longer than ${usernameMaxLength} characters`,
      ],
    },
    email: {
      type: String,
      required: [true, "must provide an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "must provide a password"],
    },
    role: {
      type: String,
      required: [true, "must provide a role"],
      enum: ["reader", "admin"],
      default: ["reader"],
    },
    tags: {
      type: [String],
      required: [true, "must provide an array of tags, even if its empty"],
      default: []
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
