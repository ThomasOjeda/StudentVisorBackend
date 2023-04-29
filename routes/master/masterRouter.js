
const express = require("express");

const { chartsMasterRouter } = require("./charts");
const { usersMasterRouter } = require("./users");
const { studentFilesMetadataMasterRouter } = require("./student-file-metadata")

const masterAuthentication = require("../../middleware/master/master-authentication");

const router = express.Router();

router.use("/charts",masterAuthentication, chartsMasterRouter);
router.use("/users",masterAuthentication, usersMasterRouter);
router.use("/studentfiles",masterAuthentication, studentFilesMetadataMasterRouter)

module.exports = router;
