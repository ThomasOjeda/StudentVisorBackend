const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../../../errors/errors-index");
const studentFileMetadata = require("../../../models/student-file-metadata");
const { PythonShell } = require("python-shell");
const chart = require("../../../models/chart");
const TransformationType = require("../../../models/transformation-types");

const studentMovementsHandler = async (req, res) => {
  if (!req.body.transformationBody.yearA || !req.body.transformationBody.yearB)
    throw new BadRequest("Student movements transformations require a yearA and yearB in the transformation body");

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
    type: TransformationType.STMV,
    tags: req.body.transformationHeader.tags,
    structure: result,
  });

  res.status(StatusCodes.CREATED).json({ success: true });
};

module.exports = studentMovementsHandler;
