const tagDB = require("../models/tag");
const { NotFound } = require("../errors/errors-index");
const { UNIVERSAL_TAG } = require("./default-tags");

const checkValidAndDuplicateTags = async (tags, forceUniversal = true) => {
  tagsArray = tags;
  //Check if tags is an array of strings
  if (!Array.isArray(tagsArray))
    tagsArray = [];
  //Check if tags are valid
  for (const tag of tagsArray) {
    if (!(await tagDB.findOne({ _id: tag })))
      throw new NotFound(`No tag with value : ${tag}`);
  }
  //Filter duplicates
  filtered = tagsArray.filter((tag, index) => tags.indexOf(tag) === index);
  //Include UNIVERSAL tag if it is not already included
  if (forceUniversal && !filtered.includes(UNIVERSAL_TAG)) {
    filtered.push(UNIVERSAL_TAG);
  }
  return filtered;
};

module.exports = checkValidAndDuplicateTags;
