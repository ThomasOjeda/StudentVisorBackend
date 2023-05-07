const express = require("express");

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");

const usersRouter = express.Router();

usersRouter.get("/", getAllUsers);
usersRouter.get("/:id", getUser);
usersRouter.patch("/:id", updateUser);
usersRouter.delete("/:id", deleteUser);

module.exports = usersRouter;
