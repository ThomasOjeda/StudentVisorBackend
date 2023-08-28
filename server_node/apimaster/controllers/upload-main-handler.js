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
  let tempFolder = "/studentsdata/temp_files";
  let tempFilename = uuidv4();
  const storage = multer.diskStorage({
    destination: tempFolder,
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
  if (!req.file) {
    throw new BadRequest("File not found in request");
  }
  if (!req.body.type) {
    await fs.unlink(tempFolder + "/" + tempFilename);
    throw new BadRequest("File type not found in request");
  }
  const handler = handlers[req.body.type];
  if (handler == undefined) {
    await fs.unlink(tempFolder + "/" + tempFilename);
    throw new NotFound("File type is not supported");
  }

  await handlers[req.body.type](req, res, tempFolder, tempFilename);
};

const deleteFile = async (req, res) => {
  const { id: fileId } = req.params;
  let result = await studentFileMetadata.findOneAndDelete({ _id: fileId });

  if (!result) throw new NotFound(`No file with id : ${fileId}`);

  await fs.unlink(result.folder + "/" + result.filename);

  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = { uploadMainHandler, deleteFile };
