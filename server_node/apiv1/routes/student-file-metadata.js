const express = require("express");

const {
  getAllStudentFileMetadata,
  getStudentFileMetadata,
  updateStudentFileMetadata,
} = require("../controllers/student-file-metadata.js");

const studentFilesMetadataRouter = express.Router();

studentFilesMetadataRouter.get("/", getAllStudentFileMetadata);
studentFilesMetadataRouter.get("/:id", getStudentFileMetadata);
studentFilesMetadataRouter.patch("/:id", updateStudentFileMetadata);

module.exports = studentFilesMetadataRouter;
