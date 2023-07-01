const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../../../errors/errors-index");
const studentFileMetadata = require("../../../models/student-file-metadata");
const { PythonShell } = require("python-shell");
const chart = require("../../../models/chart");
const TransformationType = require("../../../models/transformation-types");

const studentInscriptionsHandler = async (req, res) => {
  if (!req.body.transformationBody.year)
    throw new BadRequest("Student inscriptions transformations require a year in the transformation body");

  yearMetadata = await studentFileMetadata.findOne({
    year: req.body.transformationBody.year,
  });

  if (!yearMetadata) throw new BadRequest("Requested year is not available");

  req.body.transformationBody.yearPath = yearMetadata.folder.concat(
    "/",
    yearMetadata.filename
  );

  let pythonCallOptions = {
    mode: "text",
    args: [JSON.stringify(req.body)],
  };

  result = (
    await PythonShell.run(
      "./data_transformation/data-transformation.py",
      pythonCallOptions
    )
  )[0];

  result = JSON.parse(result);

  await chart.create({
    name: req.body.transformationHeader.name,
    type: TransformationType.INSC,
    tags: req.body.transformationHeader.tags,
    structure: result,
  });

  res.status(StatusCodes.CREATED).json({ success: true });
};

module.exports = studentInscriptionsHandler;
