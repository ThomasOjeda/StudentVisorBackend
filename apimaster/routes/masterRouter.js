
const express = require("express");

const { chartsMasterRouter } = require("./charts");
const { usersMasterRouter } = require("./users");
const { studentFilesMetadataMasterRouter } = require("./student-file-metadata")

const masterAuthentication = require("../middleware/master-authentication");

const masterRouter = express.Router();

masterRouter.use("/charts",masterAuthentication, chartsMasterRouter);
masterRouter.use("/users",masterAuthentication, usersMasterRouter);
masterRouter.use("/studentfiles",masterAuthentication, studentFilesMetadataMasterRouter)

module.exports = masterRouter;
