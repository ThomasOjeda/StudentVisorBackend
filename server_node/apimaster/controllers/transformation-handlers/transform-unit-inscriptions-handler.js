const { BadRequest, PyflaskError } = require("../../../errors/errors-index");
const studentFileMetadata = require("../../../models/student-file-metadata");
const { PYFLASK_URL } = require("../../../config/config");
const FileType = require("../../../models/file-types");

const axios = require("axios");

const unitInscriptionsHandler = async (req, res, next) => {
  if (!req.body.transformationBody.year)
    throw new BadRequest(
      "Unit inscriptions transformations require a year in the transformation body"
    );

  yearMetadata = await studentFileMetadata.findOne({
    year: req.body.transformationBody.year,
    type: FileType.STUDENT_INSCRIPTIONS,
  });

  if (!yearMetadata) throw new BadRequest("Requested year is not available");

  req.body.transformationBody.yearPath = yearMetadata.folder.concat(
    "/",
    yearMetadata.filename
  );
  let result = null;
  try {
    result = await axios.post(
      PYFLASK_URL + "/transformations/unitinscriptions",
      req.body
    );
  } catch (error) {
    throw new PyflaskError(error.response.data);
  }

  req.body.calculatedResult = result.data;

  next();
};

module.exports = unitInscriptionsHandler;
