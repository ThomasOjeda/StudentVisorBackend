const express = require("express");

const chartsMasterRouter = require("./chart");
const usersMasterRouter = require("./user");
const studentFilesMetadataMasterRouter = require("./student-file-metadata");
const transformationsMasterRouter = require("./transformation");
const uploadsMasterRouter = require("./upload")

const masterAuthentication = require("../middleware/master-authentication");

const masterRouter = express.Router();

masterRouter.use("/uploads", uploadsMasterRouter)
masterRouter.use("/transformations", transformationsMasterRouter);
masterRouter.use("/charts", masterAuthentication, chartsMasterRouter);
masterRouter.use("/users", masterAuthentication, usersMasterRouter);
masterRouter.use(
  "/studentfiles",
  masterAuthentication,
  studentFilesMetadataMasterRouter
);

module.exports = masterRouter;
