const express = require("express");

const {
  uploadMainHandler,
  deleteFile,
} = require("../controllers/upload-main-handler");
const uploadMiddleware = require("../middleware/uploadMiddleware");

const uploadsMasterRouter = express.Router();

uploadsMasterRouter.post("/", uploadMiddleware, uploadMainHandler);

uploadsMasterRouter.delete("/:id", deleteFile);

module.exports = uploadsMasterRouter;
