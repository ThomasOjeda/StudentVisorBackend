const studentFileMetadata = require("../../models/student-file-metadata");
const { NotFound } = require("../../errors/errors-index");
const { StatusCodes } = require("http-status-codes");

const getAllStudentFileMetadata = async (req, res) => {
  const resultFiles = await studentFileMetadata.find({}, "-folder");
  res
    .status(StatusCodes.OK)
    .json({ success: true, result: resultFiles, nHits: resultFiles.length });
};

const getStudentFileMetadata = async (req, res) => {
  const { id: fileId } = req.params;
  const resultFile = await studentFileMetadata.findOne(
    { _id: fileId },
    "-folder"
  );
  if (!resultFile) throw new NotFound(`No file with id : ${fileId}`);
  res.status(StatusCodes.OK).json({ success: true, result: resultFile });
};

module.exports = {
  getAllStudentFileMetadata,
  getStudentFileMetadata,
};
