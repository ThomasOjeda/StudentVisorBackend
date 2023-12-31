const studentFileMetadata = require("../../models/student-file-metadata");
const { NotFound } = require("../../errors/errors-index");
const { StatusCodes } = require("http-status-codes");

const getAllStudentFileMetadata = async (req, res) => {
  const resultFiles = await studentFileMetadata.find(req.query, "-folder");
  res
    .status(StatusCodes.OK)
    .json({ success: true, result: resultFiles, nHits: resultFiles.length });
};

const getStudentFileMetadata = async (req, res) => {
  const { id: fileId } = req.params;
  const resultFile = await studentFileMetadata.findOne(
    { _id: fileId },
    "-folder -filename"
  );
  if (!resultFile) throw new NotFound(`No file with id : ${fileId}`);
  res.status(StatusCodes.OK).json({ success: true, result: resultFile });
};

const updateStudentFileMetadata = async (req, res) => {
  const { id: fileId } = req.params;
  let updated = {};
  if (req.body.name) updated.name = req.body.name;
  if (req.body.description) updated.description = req.body.description;
  const resultFile = await studentFileMetadata.findOneAndUpdate(
    { _id: fileId },
    updated,
    {
      fields: "-folder -filename",
      new: true,
      runValidators: true,
    }
  );
  if (!resultFile) throw new NotFound(`No file with id : ${fileId}`);
  res.status(StatusCodes.OK).json({ success: true, result: resultFile });
};

module.exports = {
  getAllStudentFileMetadata,
  getStudentFileMetadata,
  updateStudentFileMetadata,
};
