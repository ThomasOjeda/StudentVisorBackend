const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../../../errors/errors-index");
const studentFileMetadata = require("../../../models/student-file-metadata");
const chart = require("../../../models/chart");
const TransformationType = require("../../../models/transformation-types");
const { PYFLASK_URL } = require("../../../config/config");
const axios = require("axios");

const studentInscriptionsHandler = async (req, res) => {
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
    throw error;
  }

  await chart.create({
    name: req.body.transformationHeader.name,
    type: TransformationType.INSC,
    tags: req.body.transformationHeader.tags,
    structure: result.data,
  });

  res.status(StatusCodes.CREATED).json({ success: true });
};

module.exports = studentInscriptionsHandler;
