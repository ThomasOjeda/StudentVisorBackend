const { StatusCodes } = require("http-status-codes");
const fs = require("fs/promises");
const axios = require("axios");
const studentFileMetadata = require("../../../models/student-file-metadata");
const { PYFLASK_URL } = require("../../../config/config");
const {
  STUDENT_SCHOLARSHIPS_FOLDER,
  PICKLE_SUFFIX,
} = require("../../../config/paths");
const Conflict = require("../../../errors/conflict");

const uploadScholarshipsHandler = async (req, res) => {
  try {
    let found = await studentFileMetadata.findOne({
      year: req.body.year,
      type: req.body.type,
    });
    if (found) {
      throw new Conflict(
        `There is already a file for the year ${req.body.year} in the students scholarships category.`
      );
    }
  } catch (error) {
    await fs.unlink(req.body.tempFolder + "/" + req.body.tempFilename);
    throw error;
  }

  //WARNING: the folder where the resulting .pickle file is stored MUST exist!
  try {
    //Check if folder exists
    await fs.access(STUDENT_SCHOLARSHIPS_FOLDER);
  } catch (error) {
    //Folder does not exist, create folder
    try {
      await fs.mkdir(STUDENT_SCHOLARSHIPS_FOLDER);
    } catch (error) {
      await fs.unlink(req.body.tempFolder + "/" + req.body.tempFilename);
      throw error;
    }
  }

  try {
    await axios.post(PYFLASK_URL + "/conversions/studentscholarships", {
      type: req.body.type,
      sourceFile: req.body.tempFolder + "/" + req.body.tempFilename,
      destinationFile:
        STUDENT_SCHOLARSHIPS_FOLDER +
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
      folder: STUDENT_SCHOLARSHIPS_FOLDER,
      type: req.body.type,
    });
    res.status(StatusCodes.CREATED).json({ success: true });
  } catch (error) {
    await fs.unlink(
      STUDENT_SCHOLARSHIPS_FOLDER +
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

module.exports = uploadScholarshipsHandler;
