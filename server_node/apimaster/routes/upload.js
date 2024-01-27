const express = require("express");

const {
  uploadMainHandler,
  deleteFile,
} = require("../controllers/upload-main-handler");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const updateScholarshipsHandler = require("../controllers/upload-handlers/update-scholarship-handler");

const uploadsMasterRouter = express.Router();

uploadsMasterRouter.post("/", uploadMiddleware, uploadMainHandler);
uploadsMasterRouter.post(
  "/scholarships/update",
  uploadMiddleware,
  updateScholarshipsHandler
);

uploadsMasterRouter.delete("/:id", deleteFile);

module.exports = uploadsMasterRouter;
