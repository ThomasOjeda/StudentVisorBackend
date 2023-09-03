const express = require("express");

const {
  login,
  register,
} = require("../../apimaster/controllers/authentication");

const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/register", authentication, authorization("admin"), register);

module.exports = authRouter;
