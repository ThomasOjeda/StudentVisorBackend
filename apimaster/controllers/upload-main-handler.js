const { BadRequest, NotFound } = require("../../errors/errors-index");
const multer = require("multer");
const util = require("util");
const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");
const studentFileMetadata = require("../../models/student-file-metadata");
const { StatusCodes } = require("http-status-codes");

const handlers = {
  "student-inscriptions": require("./upload-handlers/upload-inscriptions-handler"),
};

const uploadMainHandler = async (req, res) => {
  tempFilename = uuidv4();

  const storage = multer.diskStorage({
    destination: "./temp-files",
    filename: function (req, file, cb) {
      cb(null, tempFilename);
    },
  });
  const upload = multer({ storage: storage }).single("uploaded_file");
  uploadPromise = util.promisify(upload);

  result = await uploadPromise(req, res);

  if (result !== undefined) {
    throw result;
  }

  if (!req.body.fileType) {
    await fs.unlink("./temp-files/" + tempFilename);

    throw new BadRequest("File type not found in request");
  }

  const handler = handlers[req.body.fileType];
  if (handler == undefined) {
    await fs.unlink("./temp-files/" + tempFilename);
    throw new NotFound("File type is not supported");
  }

  await handlers[req.body.fileType](req, res, tempFilename);
};

const deleteFile = async (req, res) => {
  const { id: fileId } = req.params;
  let result = await studentFileMetadata.findOneAndDelete({ _id: fileId });

  if (!result) throw new NotFound(`No file with id : ${fileId}`);

  await fs.unlink(result.folder + "/" + result.filename);

  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = { uploadMainHandler, deleteFile };
