const express = require("express");

const {
  uploadMainHandler,
  deleteFile,
} = require("../controllers/up-down-load-main-handler");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const updateScholarshipsHandler = require("../controllers/upload-handlers/update-scholarship-handler");
const sendFileToClient = require("../controllers/download-handlers/download-file");

const uploadsMasterRouter = express.Router();

uploadsMasterRouter.post("/", uploadMiddleware, uploadMainHandler);
uploadsMasterRouter.post(
  "/scholarships/update",
  uploadMiddleware,
  updateScholarshipsHandler
);
uploadsMasterRouter.get("/:id", sendFileToClient);

uploadsMasterRouter.delete("/:id", deleteFile);

module.exports = uploadsMasterRouter;
