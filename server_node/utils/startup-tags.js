const tag = require("../models/tag");
const { DEFAULT_TAGS } = require("./default-tags");

const startupTag = async () => {
  try {
    for (const defTag of Object.keys(DEFAULT_TAGS)) {
      let resultTag = await tag.findOne({ _id: defTag });
      if (!resultTag) {
        created = await tag.create({
          _id: defTag,
          description: DEFAULT_TAGS[defTag],
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = startupTag;
