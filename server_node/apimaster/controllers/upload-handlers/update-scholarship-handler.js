const { StatusCodes } = require("http-status-codes");
const fs = require("fs/promises");
const axios = require("axios");
const studentFileMetadata = require("../../../models/student-file-metadata");
const { PYFLASK_URL } = require("../../../config/config");
const { NotFound } = require("../../../errors/errors-index");
const { v4: uuidv4 } = require("uuid");
const { PICKLE_SUFFIX } = require("../../../config/paths");

const updateScholarshipsHandler = async (req, res) => {
  let currentDataFile = null;

  try {
    currentDataFile = await studentFileMetadata.findOne({
      year: req.body.year,
      type: req.body.type,
    });
    if (!currentDataFile) {
      throw new NotFound(
        `No scholarship file found with year ${req.body.year} and type ${req.body.type}.`
      );
    }
  } catch (error) {
    await fs.unlink(req.body.tempFolder + "/" + req.body.tempFilename);
    throw error;
  }

  const destinationFilename =
    currentDataFile.year +
    "_" +
    currentDataFile.type +
    "_" +
    uuidv4() +
    PICKLE_SUFFIX;

  const destinationFilepath =
    currentDataFile.folder + "/" + destinationFilename; //The complete file path for a new file that will contain the result of the operation

  try {
    await axios.post(PYFLASK_URL + "/conversions/studentscholarships/update", {
      newDataFile: req.body.tempFolder + "/" + req.body.tempFilename, //The file that holds the new data
      currentDataFile: currentDataFile.folder + "/" + currentDataFile.filename, //The file that holds the current data
      destinationFile:
        //The file that will hold the combination of the new and old data
        destinationFilepath,
      type: currentDataFile.type,
    });
  } catch (error) {
    await fs.unlink(req.body.tempFolder + "/" + req.body.tempFilename);
    throw error;
  }

  let result;
  try {
    result = await studentFileMetadata.findOneAndUpdate(
      //result will hold the old file data
      { _id: currentDataFile._id },
      { filename: destinationFilename }
    );
  } catch (error) {
    //In case the db update fails, delete de temp file and the new file
    try {
      await fs.unlink(req.body.tempFolder + "/" + req.body.tempFilename);
    } catch (error) {}
    try {
      await fs.unlink(destinationFilepath);
    } catch (error) {}
    throw error;
  }

  if (!result) {
    //In case the file was not found , then it was deleted
    try {
      await fs.unlink(req.body.tempFolder + "/" + req.body.tempFilename);
    } catch (error) {}
    try {
      await fs.unlink(destinationFilepath);
    } catch (error) {}
    throw new NotFound("The requested scholarship file was not found");
  }

  // If everything goes right, delete temp file and the old file
  try {
    await fs.unlink(req.body.tempFolder + "/" + req.body.tempFilename);
  } catch (error) {}
  try {
    await fs.unlink(result.folder + "/" + result.filename);
  } catch (error) {}

  let old_version = result.toJSON(); //Do not send the folder and filename in response. Only JSON can be modified

  delete old_version.filename;
  delete old_version.folder;
  res.status(StatusCodes.OK).json({
    success: true,
    old_version: old_version,
  });
};

module.exports = updateScholarshipsHandler;
