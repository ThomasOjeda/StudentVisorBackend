const express = require("express");

const {
  getAllStudentFileMetadata,
  getStudentFileMetadata,
} = require("../controllers/student-file-metadata.js");

const studentFilesMetadataRouter = express.Router();

studentFilesMetadataRouter.get("/", getAllStudentFileMetadata);
studentFilesMetadataRouter.get("/:id", getStudentFileMetadata);

module.exports = studentFilesMetadataRouter;
