const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../../../errors/errors-index");
const studentFileMetadata = require("../../../models/student-file-metadata");
const { PythonShell } = require("python-shell");
const chart = require("../../../models/chart");

const studentMovementsHandler = async (req, res) => {
  if (!req.body.transformation.yearA || !req.body.transformation.yearB)
    throw new BadRequest("Transformation object is malformed");

  yearAMetadata = await studentFileMetadata.findOne({
    year: req.body.transformation.yearA,
  });

  yearBMetadata = await studentFileMetadata.findOne({
    year: req.body.transformation.yearB,
  });

  if (!yearAMetadata || !yearBMetadata)
    throw new BadRequest("Requested years are not available");

  req.body.transformation.yearAPath = yearAMetadata.folder.concat(
    "/",
    yearAMetadata.filename
  );
  req.body.transformation.yearBPath = yearBMetadata.folder.concat(
    "/",
    yearBMetadata.filename
  );

  let pythonCallOptions = {
    mode: "text",
    args: [JSON.stringify(req.body.transformation)],
  };

  result = (
    await PythonShell.run(
      "data_transformation/data-transformation.py",
      pythonCallOptions
    )
  )[0];

  result = JSON.parse(result);

  await chart.create({ name: req.body.transformation.name, structure: result });

  res.status(StatusCodes.CREATED).json({ success: true });
};

module.exports = studentMovementsHandler;
