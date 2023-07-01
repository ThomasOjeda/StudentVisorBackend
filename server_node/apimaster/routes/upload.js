const express = require("express");

const {
  uploadMainHandler,
  deleteFile,
} = require("../controllers/upload-main-handler");

const uploadsMasterRouter = express.Router();

uploadsMasterRouter.post("/", uploadMainHandler);

uploadsMasterRouter.delete("/:id", deleteFile);

module.exports = uploadsMasterRouter;
