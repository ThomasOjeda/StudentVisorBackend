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
const authorization = require("../middleware/authorization");

const usersRouter = express.Router();

usersRouter.get("/other", authorization("admin"), getOtherUsers);
usersRouter.get("/", authorization("admin"), getAllUsers);
usersRouter.get("/mine", getMyUser);
usersRouter.get("/:id", authorization("admin"), getUser);
usersRouter.patch("/mine", updateMyUser);
usersRouter.patch("/:id", authorization("admin"), updateUser);
usersRouter.delete("/unsafe/:id", authorization("admin"), deleteUser);
usersRouter.delete("/:id", authorization("admin"), safeDeleteUser);

module.exports = usersRouter;
