const express = require("express");

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../../controllers/master/user");

const usersMasterRouter = express.Router();

usersMasterRouter.get("/", getAllUsers);
usersMasterRouter.get("/:id", getUser);
usersMasterRouter.patch("/:id", updateUser);
usersMasterRouter.delete("/:id", deleteUser);

module.exports = { usersMasterRouter };
