const express = require("express");

const {
  getOtherUsers,
  getAllUsers,
  getUser,
  getMyUser,
  updateMyUser,
  updateUser,
  safeDeleteUser,
  deleteUser,
} = require("../controllers/user");

const usersRouter = express.Router();

usersRouter.get("/other", getOtherUsers);
usersRouter.get("/", getAllUsers);
usersRouter.get("/mine", getMyUser);
usersRouter.get("/:id", getUser);
usersRouter.patch("/mine", updateMyUser);
usersRouter.patch("/:id", updateUser);
usersRouter.delete("/unsafe/:id", deleteUser);
usersRouter.delete("/:id", safeDeleteUser);

module.exports = usersRouter;
