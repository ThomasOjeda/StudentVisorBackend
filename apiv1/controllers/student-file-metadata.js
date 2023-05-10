const studentFileMetadata = require("../../models/student-file-metadata");
const { NotFound } = require("../../errors/errors-index");
const { StatusCodes } = require("http-status-codes");

const getAllStudentFileMetadata = async (req, res) => {
  resultFiles = await studentFileMetadata.find({});
  res
    .status(StatusCodes.OK)
    .json({ success: true, result: resultFiles, nHits: resultFiles.length });
};

const getStudentFileMetadata = async (req, res) => {
  const { id: fileId } = req.params;
  resultFile = await studentFileMetadata.findOne({ _id: fileId });
  if (!resultFile) throw new NotFound(`No file with id : ${fileId}`);
  res.status(StatusCodes.OK).json({ success: true, result: resultFile });
};

module.exports = {
  getAllStudentFileMetadata,
  getStudentFileMetadata,
};
