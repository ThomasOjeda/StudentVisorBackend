const checkValidAndDuplicateTags = require("../../../utils/check-valid-and-duplicate-tags");

const checkTags = async (req, res, next) => {
  //Check if there is specified tags for this transformation
  if (req.body.transformationHeader && req.body.transformationHeader.tags)
    if (req.body.transformationHeader.tags.length > 0)
      req.body.transformationHeader.tags = await checkValidAndDuplicateTags(
        req.body.transformationHeader.tags
      );
    else req.body.transformationHeader.tags = [];

  next();
};

module.exports = checkTags;
