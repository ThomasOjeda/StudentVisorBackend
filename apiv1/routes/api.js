const express = require("express");

const { chartsRouter } = require("./charts");
const { usersRouter } = require("./users");
const { authRouter } = require("./auth");
const authentication = require("../middleware/authentication");

const router = express.Router();

router.use("/charts",authentication, chartsRouter);
router.use("/users",authentication, usersRouter);
router.use("/auth", authRouter);

module.exports = router;
