const mongoose = require("mongoose");

const MIN_YEAR = 1950;
const MAX_YEAR = 2100;

const StudentFileMetadataSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: [true, "must provide a year"],
      min: [MIN_YEAR, `must provide a year after ${MIN_YEAR}`],
      max: [MAX_YEAR, `must provide a year before ${MAX_YEAR}`],
      unique: true,
    },
    filename: {
      type: String,
      required: [true, "must provide a filename"],
    },
    filepath: {
      type: String,
      required: [true, "must provide a filepath"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "StudentFileMetadata",
  StudentFileMetadataSchema
);
