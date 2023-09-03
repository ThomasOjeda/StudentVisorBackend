const express = require("express");

const uploadsMasterRouter = require("./upload");
const transformationsMasterRouter = require("./transformation");
const chartsMasterRouter = require("./chart");
const usersMasterRouter = require("./user");
const studentFilesMetadataMasterRouter = require("./student-file-metadata");
const tagsMasterRouter = require("./tag");
const authMasterRouter = require("./auth");

const masterRouter = express.Router();

masterRouter.use("/uploads", uploadsMasterRouter);
masterRouter.use("/transformations", transformationsMasterRouter);
masterRouter.use("/charts", chartsMasterRouter);
masterRouter.use("/users", usersMasterRouter);
masterRouter.use("/studentfiles", studentFilesMetadataMasterRouter);
masterRouter.use("/tags", tagsMasterRouter);
masterRouter.use("/auth", authMasterRouter);

module.exports = masterRouter;
