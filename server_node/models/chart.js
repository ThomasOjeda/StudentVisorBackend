const mongoose = require("mongoose");

const nameMaxLength = 256;
const descriptionMaxLength = 512;

const ChartSchema = new mongoose.Schema(
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
        `name can not be longer than ${descriptionMaxLength} characters`,
      ],
    },
    tags: {
      type: [String],
      required: [true, "must provide an array of tags, even if its empty"],
      default: [],
    },
    type: {
      type: String,
      required: [true, "must provide a type"],
    },
    structure: {
      required: [true, "must provide an structure"],
      type: mongoose.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chart", ChartSchema);
