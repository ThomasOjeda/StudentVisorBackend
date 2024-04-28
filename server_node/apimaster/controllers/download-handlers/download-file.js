const fs = require("fs/promises");
const axios = require("axios");
const studentFileMetadata = require("../../../models/student-file-metadata");
const { NotFound } = require("../../../errors/errors-index");
const { v4: uuidv4 } = require("uuid");
const { STUDENTSDATA_TEMP_FOLDER } = require("../../../config/paths");
const { PYFLASK_URL } = require("../../../config/config");

const sendFileToClient = async (req, res) => {
  const { id: fileId } = req.params;

  let fileMetadata = null;

  fileMetadata = await studentFileMetadata.findOne({
    _id: fileId,
  });
  if (!fileMetadata) {
    throw new NotFound(`There is no file with id ${fileId}`);
  }

  const excelFilePath =
    STUDENTSDATA_TEMP_FOLDER +
    "/" +
    fileMetadata.year +
    "_" +
    fileMetadata.type +
    "_" +
    uuidv4() +
    ".xlsx";

  await axios.post(PYFLASK_URL + "/conversions/filetoexcel", {
    sourceFile: fileMetadata.folder + "/" + fileMetadata.filename,
    destinationFile: excelFilePath,
  });

  res.download(excelFilePath, fileMetadata.name + ".xlsx", async (error) => {
    //Do not care about error, we have to delete the file anyway
    await fs.unlink(excelFilePath);
  });
};

module.exports = sendFileToClient;
