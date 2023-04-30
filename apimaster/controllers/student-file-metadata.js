const studentFileMetadata = require("../../models/student-file-metadata");
const { NotFound } = require("../../errors/errors-index");
const { StatusCodes } = require("http-status-codes");

const getAllStudentFiles = async (req, res) => {
  resultFiles = await studentFileMetadata.find({});
  res
    .status(StatusCodes.OK)
    .json({ success: true, result: resultFiles, nHits: resultFiles.length });
};

const getStudentFile = async (req, res) => {
  const { id: fileId } = req.params;
  resultFile = await studentFileMetadata.findOne({ _id: fileId });
  if (!resultFile) throw new NotFound(`No file with id : ${fileId}`);
  res.status(StatusCodes.OK).json({ success: true, result: resultFile });
};

const updateStudentFile = async (req, res) => {
  const { id: fileId } = req.params;
  const resultFile = await studentFileMetadata.findOneAndUpdate(
    { _id: fileId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!resultFile) throw new NotFound(`No file with id : ${fileId}`);
  res.status(StatusCodes.OK).json({ success: true, result: resultFile });
};

const createStudentFile = async (req, res) => {
  created = await studentFileMetadata.create(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, result: created });
};

const deleteStudentFile = async (req, res) => {
  const { id: fileId } = req.params;
  result = await studentFileMetadata.deleteOne({ _id: fileId });

  if (result.deletedCount <= 0)
    throw new NotFound(`No file with id : ${fileId}`);
  res.status(StatusCodes.OK).json({ success: true });
};

const deleteAllStudentFiles = async (req, res) => {
  result = await studentFileMetadata.deleteMany({});
  res
    .status(StatusCodes.OK)
    .json({ success: true, nHits: result.deletedCount });
};

module.exports = {
  getAllStudentFiles,
  getStudentFile,
  updateStudentFile,
  createStudentFile,
  deleteStudentFile,
  deleteAllStudentFiles,
};
