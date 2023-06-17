const express = require("express");

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
} = require("../controllers/user");

const usersMasterRouter = express.Router();

usersMasterRouter.get("/", getAllUsers);
usersMasterRouter.get("/:id", getUser);
usersMasterRouter.post("/", createUser);
usersMasterRouter.patch("/:id", updateUser);
usersMasterRouter.delete("/:id", deleteUser);
usersMasterRouter.delete("/", deleteAllUsers);

module.exports = usersMasterRouter;
