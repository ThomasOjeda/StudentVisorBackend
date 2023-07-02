const { StatusCodes } = require("http-status-codes");
const fs = require("fs/promises");
const axios = require("axios");
const studentFileMetadata = require("../../../models/student-file-metadata");
const { BadRequest } = require("../../../errors/errors-index");

const uploadInscriptionsHandler = async (req, res, tempFilename) => {
  if (!req.body.year) {
    await fs.unlink("/studentsdata/temp-files/" + tempFilename);
    throw new BadRequest("An inscription upload requires a year");
  }

  await fs.rename(
    "/studentsdata/temp-files/" + tempFilename,
    "/studentsdata/students_inscriptions/" + tempFilename //the file probably does not need to have the .xlsx extension
  );

  try {
    await axios.post(
      "http://pyflask-service:5100/conversions/studentinscriptions",
      {
        data: {
          sourceFile: "/studentsdata/students_inscriptions/" + tempFilename,
          destinationFile:
            "/studentsdata/students_inscriptions/" +
            req.body.year +
            "_students.pickle",
        },
      }
    );
  } catch (error) {
    await fs.unlink("/studentsdata/students_inscriptions/" + tempFilename);
    throw error;
  }
  await fs.unlink("/studentsdata/students_inscriptions/" + tempFilename);

  try {
    await studentFileMetadata.create({
      year: req.body.year,
      filename: req.body.year + "_students.pickle",
      folder: "/studentsdata/students_inscriptions",
    });
    res.status(StatusCodes.CREATED).json({ success: true });
  } catch (error) {
    await fs.unlink(
      "/studentsdata/students_inscriptions/" +
        req.body.year +
        "_students.pickle"
    );
    throw error;
  }
};

module.exports = uploadInscriptionsHandler;
