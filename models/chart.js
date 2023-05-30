const mongoose = require("mongoose");

const nameMaxLength = 30;

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
    tags: {
      type: [String],
      required: [true, "must provide a tag"],
      default: ["public"],
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
