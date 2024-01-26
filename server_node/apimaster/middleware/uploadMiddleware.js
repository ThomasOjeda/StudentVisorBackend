const { BadRequest } = require("../../errors/errors-index");
const multer = require("multer");
const util = require("util");
const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");
const { STUDENTSDATA_TEMP_FOLDER } = require("../../config/paths");

const uploadMiddleware = async (req, res, next) => {
  let tempFilename = uuidv4();
  const storage = multer.diskStorage({
    destination: STUDENTSDATA_TEMP_FOLDER,
    filename: function (request, file, cb) {
      cb(null, tempFilename);
    },
  });
  const upload = multer({
    storage: storage,
    limits: { fileSize: 25 * 1024 * 1024 /* bytes */, files: 1 }, //Errors related to these limits cause the temporary file to not be saved at all
  }).single("uploaded_file"); //Is a function that can be used as a middleware
  uploadPromise = util.promisify(upload);

  fileSaveError = await uploadPromise(
    req,
    res
  ); /***IMPORTANT: req.body gets populated AFTER this function runs ***/

  if (fileSaveError !== undefined) {
    throw fileSaveError;
  }
  req.body.tempFilename = tempFilename;
  req.body.tempFolder = STUDENTSDATA_TEMP_FOLDER;

  if (!req.file) {
    throw new BadRequest("File not found in request");
  }
  if (!req.body.name) {
    await fs.unlink(req.body.tempFolder + "/" + req.body.tempFilename);
    throw new BadRequest("File name not found in request");
  }
  if (!req.body.year) {
    await fs.unlink(req.body.tempFolder + "/" + req.body.tempFilename);
    throw new BadRequest("File year not found in request");
  }
  if (!req.body.type) {
    await fs.unlink(req.body.tempFolder + "/" + req.body.tempFilename);
    throw new BadRequest("File type not found in request");
  }

  const { fileTypeFromFile } = await import("file-type");

  const mimetype = await fileTypeFromFile(
    req.body.tempFolder + "/" + req.body.tempFilename
  );

  if (
    !mimetype ||
    mimetype.mime !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    await fs.unlink(req.body.tempFolder + "/" + req.body.tempFilename);
    throw new BadRequest(
      "File mime type does not correspond to (.xlsx) mime type (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)"
    );
  }

  next();
};

module.exports = uploadMiddleware;
