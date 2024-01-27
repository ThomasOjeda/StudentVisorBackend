const { StatusCodes } = require("http-status-codes");
const fs = require("fs/promises");
const axios = require("axios");
const studentFileMetadata = require("../../../models/student-file-metadata");
const { PYFLASK_URL } = require("../../../config/config");
const { NotFound } = require("../../../errors/errors-index");

const updateScholarshipsHandler = async (req, res) => {
  let toBeUpdated = null;

  try {
    toBeUpdated = await studentFileMetadata.findOne({
      year: req.body.year,
      type: req.body.type,
    });
    if (!toBeUpdated) {
      throw new NotFound(
        `No scholarship file found with year ${req.body.year} and type ${req.body.type}.`
      );
    }
  } catch (error) {
    await fs.unlink(req.body.tempFolder + "/" + req.body.tempFilename);
    throw error;
  }

  try {
    await axios.post(PYFLASK_URL + "/conversions/studentscholarships/update", {
      sourceFile: req.body.tempFolder + "/" + req.body.tempFilename,
      destinationFile: toBeUpdated.folder + "/" + toBeUpdated.filename,
      type: toBeUpdated.type,
    });
  } catch (error) {
    await fs.unlink(req.body.tempFolder + "/" + req.body.tempFilename);
    throw error;
  }

  await fs.unlink(req.body.tempFolder + "/" + req.body.tempFilename);
  await studentFileMetadata.findOneAndUpdate({ _id: toBeUpdated._id }, {}); //Trigger a dummy update to update the updatedAt field with the current date.
  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = updateScholarshipsHandler;
