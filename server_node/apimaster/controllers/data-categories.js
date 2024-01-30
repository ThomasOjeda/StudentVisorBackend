const { GENDER } = require("../../models/file-data-categories");
const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../../errors/errors-index");
const studentFileMetadata = require("../../models/student-file-metadata");
const axios = require("axios");
const { PYFLASK_URL } = require("../../config/config");
const FileType = require("../../models/file-types");

const getUnits = async (req, res) => {
  if (!req.body.year)
    throw new BadRequest("Year not found in data category request");

  yearMetadata = await studentFileMetadata.findOne({
    year: req.body.year,
    type: FileType.STUDENT_INSCRIPTIONS,
  });

  if (!yearMetadata) throw new BadRequest("Requested year is not available");

  req.body.yearPath = yearMetadata.folder.concat("/", yearMetadata.filename);

  let result = null;

  try {
    result = await axios.post(PYFLASK_URL + "/datacat/units", req.body);
  } catch (error) {
    throw error;
  }
  res
    .status(StatusCodes.OK)
    .json({ success: true, result: result.data, nHits: result.data.length });
};

const getUnitOffers = async (req, res) => {
  if (!req.body.year)
    throw new BadRequest("Year not found in data category request");

  if (!req.body.unit)
    throw new BadRequest("Unit not found in data category request");

  yearMetadata = await studentFileMetadata.findOne({
    year: req.body.year,
    type: FileType.STUDENT_INSCRIPTIONS,
  });

  if (!yearMetadata) throw new BadRequest("Requested year is not available");

  req.body.yearPath = yearMetadata.folder.concat("/", yearMetadata.filename);

  let result = null;
  try {
    result = await axios.post(PYFLASK_URL + "/datacat/unitoffers", req.body);
  } catch (error) {
    throw error;
  }

  res
    .status(StatusCodes.OK)
    .json({ success: true, result: result.data, nHits: result.data.length });
};

const getAllGenders = async (req, res) => {
  res
    .status(StatusCodes.OK)
    .json({ success: true, result: GENDER, nHits: GENDER.length });
};

const getFileTypes = async (req, res) => {
  if (!req.body.year)
    throw new BadRequest("Year not found in data category request");

  filesInYear = await studentFileMetadata.find({
    year: req.body.year,
  });

  fileTypes = filesInYear.map((file) => {
    return file.type;
  });

  res
    .status(StatusCodes.OK)
    .json({ success: true, result: fileTypes, nHits: fileTypes.length });
};

module.exports = {
  getUnits,
  getUnitOffers,
  getAllGenders,
  getFileTypes,
};
