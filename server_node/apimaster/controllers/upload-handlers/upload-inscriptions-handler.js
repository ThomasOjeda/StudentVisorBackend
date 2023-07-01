const { StatusCodes } = require("http-status-codes");
const { PythonShell } = require("python-shell");
const fs = require("fs/promises");
const studentFileMetadata = require("../../../models/student-file-metadata");
const { BadRequest } = require("../../../errors/errors-index");

const uploadInscriptionsHandler = async (req, res, tempFilename) => {
  if (!req.body.year) {
    await fs.unlink("./temp-files/" + tempFilename);
    throw new BadRequest("An inscription upload requires a year");
  }

  await fs.rename(
    "./temp-files/" + tempFilename,
    "./data/" + tempFilename //the file probably does not need to have the .xlsx extension
  );

  let pythonCallOptions = {
    mode: "text",
    args: [
      "./data/" + tempFilename,
      "./data/" + req.body.year + "_students.pickle",
    ],
  };

  try {
    result = (
      await PythonShell.run(
        "./data_transformation/transformations/utils/to-pickle.py",
        pythonCallOptions
      )
    )[0];
  } catch (error) {
    await fs.unlink("./data/" + tempFilename);
    throw error;
  }
  await fs.unlink("./data/" + tempFilename);

  try {
    await studentFileMetadata.create({
      year: req.body.year,
      filename: req.body.year + "_students.pickle",
      folder: "./data",
    });
    res.status(StatusCodes.CREATED).json({ success: true });
  } catch (error) {
    await fs.unlink("./data/" + req.body.year + "_students.pickle");
    throw error;
  }
};

module.exports = uploadInscriptionsHandler;
