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
const uploadInscriptionsHandler = async (
  req,
  res,
  tempFolder,
  tempFilename
) => {
  try {
    let found = await studentFileMetadata.findOne({ year: req.body.year });
    if (found) {
      throw new Conflict(
        `There is already a file for the year ${req.body.year} in the students inscriptions category.`
      );
    }
  } catch (error) {
    await fs.unlink(tempFolder + "/" + tempFilename);
    throw error;
  }

  //WARNING: the folders MUST exist! this rename moves the file but does not create the folder if it does not exist!
  try {
    //Check if folder exists
    await fs.access(STUDENT_INSCRIPTIONS_FOLDER);
  } catch (error) {
    //Folder does not exist, create folder
    try {
      await fs.mkdir(STUDENT_INSCRIPTIONS_FOLDER);
    } catch (error) {
      await fs.unlink(tempFolder + "/" + tempFilename);
      throw error;
    }
  }

  try {
    await axios.post(PYFLASK_URL + "/conversions/studentinscriptions", {
      sourceFile: tempFolder + "/" + tempFilename,
      destinationFile:
        STUDENT_INSCRIPTIONS_FOLDER +
        "/" +
        req.body.year +
        "_" +
        req.body.type +
        "_" +
        tempFilename +
        PICKLE_SUFFIX,
    });
  } catch (error) {
    await fs.unlink(tempFolder + "/" + tempFilename);

    throw error;
  }
  await fs.unlink(tempFolder + "/" + tempFilename);

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
        tempFilename +
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
        tempFilename +
        PICKLE_SUFFIX
    );
    throw error;
  }
};

module.exports = uploadInscriptionsHandler;
