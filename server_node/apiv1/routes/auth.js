const express = require("express");

const {
  login,
  register,
} = require("../../apimaster/controllers/authentication");

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/register", register);

module.exports = authRouter;
