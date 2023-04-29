const express = require("express");

const {
  getAllStudentFiles,
  getStudentFile,
  updateStudentFile,
  createStudentFile,
  deleteStudentFile,
  deleteAllStudentFiles
} = require("../../controllers/master/student-file-metadata.js");

const studentFilesMetadataMasterRouter = express.Router();

studentFilesMetadataMasterRouter.get("/", getAllStudentFiles);
studentFilesMetadataMasterRouter.get("/:id", getStudentFile);
studentFilesMetadataMasterRouter.patch("/:id", updateStudentFile);
studentFilesMetadataMasterRouter.post("/", createStudentFile);
studentFilesMetadataMasterRouter.delete("/:id", deleteStudentFile);
studentFilesMetadataMasterRouter.delete("/", deleteAllStudentFiles);

module.exports = { studentFilesMetadataMasterRouter };
