const tag = require("../models/tag");

const startupTag = async () => {
  try {
    let resultTag = await tag.findOne({ _id: "PUBLIC" });
    if (!resultTag) {
      created = await tag.create({
        _id: "PUBLIC",
        description: "Disponible para todos",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = startupTag;
