const express = require("express");

const {
  getAllStudentFileMetadata,
  getStudentFileMetadata,
  updateStudentFileMetadata,
  createStudentFileMetadata,
  deleteStudentFileMetadata,
  deleteAllStudentFilesMetadata
} = require("../controllers/student-file-metadata.js");

const studentFilesMetadataMasterRouter = express.Router();

studentFilesMetadataMasterRouter.get("/", getAllStudentFileMetadata);
studentFilesMetadataMasterRouter.get("/:id", getStudentFileMetadata);
studentFilesMetadataMasterRouter.patch("/:id", updateStudentFileMetadata);
studentFilesMetadataMasterRouter.post("/", createStudentFileMetadata);
studentFilesMetadataMasterRouter.delete("/:id", deleteStudentFileMetadata);
studentFilesMetadataMasterRouter.delete("/", deleteAllStudentFilesMetadata);

module.exports = studentFilesMetadataMasterRouter;
