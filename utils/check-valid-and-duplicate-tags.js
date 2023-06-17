const tagDB = require("../models/tag");
const { NotFound, BadRequest } = require("../errors/errors-index");

const checkValidAndDuplicateTags = async (tags) => {
  //Check if tags is an array of strings
  if (!Array.isArray(tags))
    throw new BadRequest("Tags must be an array of string");
  //Check if tags are valid
  for (const tag of tags) {
    if (!(await tagDB.findOne({ _id: tag })))
      throw new NotFound(`No tag with value : ${tag}`);
  }
  //Filter duplicates
  filtered = tags.filter((tag, index) => tags.indexOf(tag) === index);
  return filtered;
};

module.exports = checkValidAndDuplicateTags;
