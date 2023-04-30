const BadRequest = require("../errors/bad-request");
const NotFound = require("../errors/not-found");


const validTransformations = {
    "st-mv": studentMovementHandler
}

const transformationValidation = (req, res, next) => {
    if (!req.body.transformation)
    throw new BadRequest("Transformation object not found in request");

  if (req.body.transformation.type == "st-mv") {
    if (!req.body.transformation.yearA || !req.body.transformation.yearB)
      throw new BadRequest("Transformation object is malformed");
    else return next();
  } else if (req.body.transformation.type == "insc") {
    if (!req.body.transformation.year)
      throw new BadRequest("Transformation object is malformed");
    else return next();
  }

  throw new NotFound("Transformation type is non-existant");

};

module.exports = transformationValidation;
