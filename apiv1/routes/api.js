const express = require("express");

const chartsRouter = require("./chart");
const usersRouter = require("./user");
const authRouter = require("./auth");
const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");

const router = express.Router();

router.use("/charts", authentication, chartsRouter);
router.use("/users", authentication, authorization("admin"), usersRouter);
router.use("/auth", authRouter);

module.exports = router;
