const { BadRequest } = require("../../../errors/errors-index");
const studentFileMetadata = require("../../../models/student-file-metadata");
const { PYFLASK_URL } = require("../../../config/config");
const FileType = require("../../../models/file-types");

const axios = require("axios");

const scholarshipMovementsHandler = async (req, res, next) => {
  if (!req.body.transformationBody.schType)
    throw new BadRequest(
      "Student scholarship movements transformations require a schType transformation body"
    );

  if (!req.body.transformationBody.yearA || !req.body.transformationBody.yearB)
    throw new BadRequest(
      "Student scholarship movements transformations require a yearA and yearB in the transformation body"
    );

  scholarshipsMetadata = await studentFileMetadata.findOne({
    year: req.body.transformationBody.yearB,
    type: req.body.transformationBody.schType,
  });

  yearAMetadata = await studentFileMetadata.findOne({
    year: req.body.transformationBody.yearA,
    type: FileType.STUDENT_INSCRIPTIONS,
  });

  yearBMetadata = await studentFileMetadata.findOne({
    year: req.body.transformationBody.yearB,
    type: FileType.STUDENT_INSCRIPTIONS,
  });

  if (!scholarshipsMetadata)
    throw new BadRequest("Requested scholarship year is not available");

  if (!yearAMetadata)
    throw new BadRequest("Requested inscription year yearA is not available");

  if (!yearBMetadata)
    throw new BadRequest("Requested inscription year yearB is not available");

  req.body.transformationBody.scholarshipsPath =
    scholarshipsMetadata.folder.concat("/", scholarshipsMetadata.filename);

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
      PYFLASK_URL + "/transformations/studentscholarshipsmovements",
      req.body
    );
  } catch (error) {
    throw error;
  }

  req.body.calculatedResult = result.data;

  next();
};

module.exports = scholarshipMovementsHandler;
