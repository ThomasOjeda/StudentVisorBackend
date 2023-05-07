const express = require("express");

const uploadMainHandler = require("../controllers/upload-main-handler");

const uploadsMasterRouter = express.Router();

uploadsMasterRouter.post("/", uploadMainHandler);

module.exports = uploadsMasterRouter;
