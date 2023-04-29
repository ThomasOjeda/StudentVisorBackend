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
    tags: {
      type: [String],
      required: [true, "must provide a tag"],
      default: ["public"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
