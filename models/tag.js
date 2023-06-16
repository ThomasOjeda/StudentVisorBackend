const mongoose = require("mongoose");

const tagValueMaxLength = 15;

const TagsSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "must provide a value"],
      trim: true,
      maxlength: [
        tagValueMaxLength,
        `value can not be longer than ${tagValueMaxLength} characters`,
      ],
    },
    description: {
      type: String,
      required: [true, "must provide a description"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tag", TagsSchema);
