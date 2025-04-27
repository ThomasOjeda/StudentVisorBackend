const checkValidAndDuplicateTags = require("../../../utils/check-valid-and-duplicate-tags");

const checkTags = async (req, res, next) => {
  //Check if there is specified tags for this transformation
  if (req.body.transformationHeader)
    req.body.transformationHeader.tags = await checkValidAndDuplicateTags(req.body.transformationHeader.tags, false);
  next();
};

module.exports = checkTags;
