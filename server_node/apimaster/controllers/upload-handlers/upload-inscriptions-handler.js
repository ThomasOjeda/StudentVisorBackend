const { StatusCodes } = require("http-status-codes");
const fs = require("fs/promises");
const axios = require("axios");
const studentFileMetadata = require("../../../models/student-file-metadata");
const { BadRequest } = require("../../../errors/errors-index");
const { PYFLASK_URL } = require("../../../config/config");

const uploadInscriptionsHandler = async (
  req,
  res,
  tempFolder,
  tempFilename
) => {
  let newFolder = "/studentsdata/students_inscriptions";
  let fileSuffix = "_students.pickle";

  if (!req.body.year) {
    await fs.unlink(tempFolder + "/" + tempFilename);
    throw new BadRequest("An inscription upload requires a year");
  }

  try {
    let found = await studentFileMetadata.findOne({ year: req.body.year });
    if (found) {
      throw new BadRequest(
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
    await fs.access(newFolder);
  } catch (error) {
    //Folder does not exist, create folder
    try {
      await fs.mkdir(newFolder);
    } catch (error) {
      await fs.unlink(tempFolder + "/" + tempFilename);
      throw error;
    }
  }

  try {
    await axios.post(PYFLASK_URL + "/conversions/studentinscriptions", {
      data: {
        sourceFile: tempFolder + "/" + tempFilename,
        destinationFile: newFolder + "/" + req.body.year + fileSuffix,
      },
    });
  } catch (error) {
    await fs.unlink(tempFolder + "/" + tempFilename);

    throw error;
  }
  await fs.unlink(tempFolder + "/" + tempFilename);

  try {
    await studentFileMetadata.create({
      year: req.body.year,
      filename: req.body.year + fileSuffix,
      folder: newFolder,
      type: req.body.type,
    });
    res.status(StatusCodes.CREATED).json({ success: true });
  } catch (error) {
    await fs.unlink(newFolder + "/" + req.body.year + fileSuffix);
    throw error;
  }
};

module.exports = uploadInscriptionsHandler;
