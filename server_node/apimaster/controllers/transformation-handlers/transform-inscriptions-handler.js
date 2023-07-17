const { BadRequest, PyflaskError } = require("../../../errors/errors-index");
const studentFileMetadata = require("../../../models/student-file-metadata");
const { PYFLASK_URL } = require("../../../config/config");
const axios = require("axios");

const studentInscriptionsHandler = async (req, res, next) => {
  if (!req.body.transformationBody.year)
    throw new BadRequest(
      "Student inscriptions transformations require a year in the transformation body"
    );

  yearMetadata = await studentFileMetadata.findOne({
    year: req.body.transformationBody.year,
  });

  if (!yearMetadata) throw new BadRequest("Requested year is not available");

  req.body.transformationBody.yearPath = yearMetadata.folder.concat(
    "/",
    yearMetadata.filename
  );
  let result = null;
  try {
    result = await axios.post(
      PYFLASK_URL + "/transformations/studentinscriptions",
      {
        data: req.body,
      }
    );
  } catch (error) {
    throw new PyflaskError(error.response.data);
  }

  req.body.calculatedResult = result.data;

  next();
};

module.exports = studentInscriptionsHandler;
