
const express = require("express");

const { chartsMasterRouter } = require("./charts");
const { usersMasterRouter } = require("./users");

const masterAuthentication = require("../../middleware/master/master-authentication");

const router = express.Router();

router.use("/charts",masterAuthentication, chartsMasterRouter);
router.use("/users",masterAuthentication, usersMasterRouter);

module.exports = router;
