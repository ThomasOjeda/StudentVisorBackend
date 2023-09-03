const mongoose = require("mongoose");

const MIN_YEAR = 1950;
const MAX_YEAR = 2100;
const nameMaxLength = 256;
const descriptionMaxLength = 512;

const StudentFileMetadataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "must provide a name"],
      trim: true,
      maxlength: [
        nameMaxLength,
        `name can not be longer than ${nameMaxLength} characters`,
      ],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [
        descriptionMaxLength,
        `description can not be longer than ${descriptionMaxLength} characters`,
      ],
    },
    year: {
      type: Number,
      required: [true, "must provide a year"],
      min: [MIN_YEAR, `must provide a year after ${MIN_YEAR}`],
      max: [MAX_YEAR, `must provide a year before ${MAX_YEAR}`],
    },
    filename: {
      type: String,
      required: [true, "must provide a filename"],
    },
    folder: {
      type: String,
      required: [true, "must provide a folder"],
    },
    type: {
      type: String,
      required: [true, "must provide a type"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "StudentFileMetadata",
  StudentFileMetadataSchema
);
