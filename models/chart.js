const mongoose = require("mongoose");

const tagMaxLength = 15;
const nameMaxLength = 30;

const ChartSchema = new mongoose.Schema(
  {
    name: {
      required: [true, "must provide a name"],
      type: String,
      trim: true,
      maxlength: [
        nameMaxLength,
        `name can not be longer than ${nameMaxLength} characters`,
      ],
    },
    tags: {
      type: [String],
      required: [true,"must provide a tag"],
      default: ['public']
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
