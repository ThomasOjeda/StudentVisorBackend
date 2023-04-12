const express = require("express");

const { chartsRouter } = require("../routes/charts");
const { usersRouter } = require("../routes/users");
const { authRouter } = require("../routes/auth");
const authentication = require("../middleware/authentication");

const router = express.Router();

router.use("/charts",authentication, chartsRouter);
router.use("/users",authentication, usersRouter);
router.use("/auth", authRouter);

module.exports = router;
