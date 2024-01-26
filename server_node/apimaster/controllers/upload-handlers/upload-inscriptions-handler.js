const { StatusCodes } = require("http-status-codes");
const fs = require("fs/promises");
const axios = require("axios");
const studentFileMetadata = require("../../../models/student-file-metadata");
const { Conflict } = require("../../../errors/errors-index");
const { PYFLASK_URL } = require("../../../config/config");
const {
  STUDENT_INSCRIPTIONS_FOLDER,
  PICKLE_SUFFIX,
} = require("../../../config/paths");
const FileType = require("../../../models/file-types");

const uploadInscriptionsHandler = async (req, res) => {
  try {
    let found = await studentFileMetadata.findOne({
      year: req.body.year,
      type: FileType.STUDENT_INSCRIPTIONS,
    });
    if (found) {
      throw new Conflict(
        `There is already a file for the year ${req.body.year} in the students inscriptions category.`
      );
    }
  } catch (error) {
    await fs.unlink(req.body.tempFolder + "/" + req.body.tempFilename);
    throw error;
  }

  //WARNING: the folder where the resulting .pickle file is stored MUST exist!
  try {
    //Check if folder exists
    await fs.access(STUDENT_INSCRIPTIONS_FOLDER);
  } catch (error) {
    //Folder does not exist, create folder
    try {
      await fs.mkdir(STUDENT_INSCRIPTIONS_FOLDER);
    } catch (error) {
      await fs.unlink(req.body.tempFolder + "/" + req.body.tempFilename);
      throw error;
    }
  }

  try {
    await axios.post(PYFLASK_URL + "/conversions/studentinscriptions", {
      sourceFile: req.body.tempFolder + "/" + req.body.tempFilename,
      destinationFile:
        STUDENT_INSCRIPTIONS_FOLDER +
        "/" +
        req.body.year +
        "_" +
        req.body.type +
        "_" +
        req.body.tempFilename +
        PICKLE_SUFFIX,
    });
  } catch (error) {
    await fs.unlink(req.body.tempFolder + "/" + req.body.tempFilename);
    throw error;
  }
  await fs.unlink(req.body.tempFolder + "/" + req.body.tempFilename);

  try {
    await studentFileMetadata.create({
      name: req.body.name,
      description: req.body.description,
      year: req.body.year,
      filename:
        req.body.year +
        "_" +
        req.body.type +
        "_" +
        req.body.tempFilename +
        PICKLE_SUFFIX,
      folder: STUDENT_INSCRIPTIONS_FOLDER,
      type: req.body.type,
    });
    res.status(StatusCodes.CREATED).json({ success: true });
  } catch (error) {
    await fs.unlink(
      STUDENT_INSCRIPTIONS_FOLDER +
        "/" +
        req.body.year +
        "_" +
        req.body.type +
        "_" +
        req.body.tempFilename +
        PICKLE_SUFFIX
    );
    throw error;
  }
};

module.exports = uploadInscriptionsHandler;
