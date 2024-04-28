const { NotFound } = require("../../errors/errors-index");
const fs = require("fs/promises");
const studentFileMetadata = require("../../models/student-file-metadata");
const { StatusCodes } = require("http-status-codes");
const FileType = require("../../models/file-types");

const handlers = {
  [FileType.STUDENT_INSCRIPTIONS]: require("./upload-handlers/new-inscriptions-handler"),
  [FileType.SCH_BELGRANO]: require("./upload-handlers/new-scholarships-handler"),
  [FileType.SCH_PROGRESAR]: require("./upload-handlers/new-scholarships-handler"),
};

const uploadMainHandler = async (req, res) => {
  const handler = handlers[req.body.type];
  if (handler == undefined) {
    await fs.unlink(req.body.tempFolder + "/" + req.body.tempFilename);
    throw new NotFound("File type is not supported");
  }

  await handler(req, res);
};

const deleteFile = async (req, res) => {
  const { id: fileId } = req.params;
  let result = await studentFileMetadata.findOneAndDelete({ _id: fileId });

  if (!result) throw new NotFound(`No file with id : ${fileId}`);

  await fs.unlink(result.folder + "/" + result.filename);

  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = { uploadMainHandler, deleteFile };
