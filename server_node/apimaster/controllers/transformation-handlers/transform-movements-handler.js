const { BadRequest } = require("../../../errors/errors-index");
const studentFileMetadata = require("../../../models/student-file-metadata");
const { PYFLASK_URL } = require("../../../config/config");
const axios = require("axios");

const studentMovementsHandler = async (req, res, next) => {
  if (!req.body.transformationBody.yearA || !req.body.transformationBody.yearB)
    throw new BadRequest(
      "Student movements transformations require a yearA and yearB in the transformation body"
    );

  yearAMetadata = await studentFileMetadata.findOne({
    year: req.body.transformationBody.yearA,
  });

  yearBMetadata = await studentFileMetadata.findOne({
    year: req.body.transformationBody.yearB,
  });

  if (!yearAMetadata || !yearBMetadata)
    throw new BadRequest("Requested years are not available");

  req.body.transformationBody.yearAPath = yearAMetadata.folder.concat(
    "/",
    yearAMetadata.filename
  );
  req.body.transformationBody.yearBPath = yearBMetadata.folder.concat(
    "/",
    yearBMetadata.filename
  );

  let result = null;
  try {
    result = await axios.post(
      PYFLASK_URL + "/transformations/studentmovements",
      req.body
    );
  } catch (error) {
    throw error;
  }

  req.body.calculatedResult = result.data;

  next();
};

module.exports = studentMovementsHandler;
