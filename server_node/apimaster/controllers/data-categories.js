const { UNIT, GENDER } = require("../../models/file-data-categories");
const { StatusCodes } = require("http-status-codes");

const getAllUnits = async (req, res) => {
  res
    .status(StatusCodes.OK)
    .json({ success: true, result: UNIT, nHits: UNIT.length });
};

//This update checks if the provided tags are valid and eliminates duplicates
const getAllGenders = async (req, res) => {
  res
    .status(StatusCodes.OK)
    .json({ success: true, result: GENDER, nHits: GENDER.length });
};

module.exports = {
  getAllUnits,
  getAllGenders,
};
