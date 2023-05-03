const { BadRequest } = require("../../errors/errors-index");
const multer = require("multer");
const util = require("util");
const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");

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
    throw result
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

module.exports = { uploadMainHandler };
