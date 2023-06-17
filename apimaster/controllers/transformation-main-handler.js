const { BadRequest, NotFound } = require("../../errors/errors-index");
const TransformationType = require("../../models/transformation-types");
const checkValidAndDuplicateTags = require("../../utils/check-valid-and-duplicate-tags");

const handlers = {
  [TransformationType.STMV]: require("./transformation-handlers/transform-movements-handler"),
  [TransformationType.INSC]: require("./transformation-handlers/transform-inscriptions-handler"),
};

const transformationHandler = async (req, res) => {
  if (!req.body.transformationHeader)
    throw new BadRequest("Transformation header not found in request");

  if (!req.body.transformationBody)
    throw new BadRequest("Transformation body not found in request");

  if (!req.body.transformationHeader.type)
    throw new BadRequest("Type not found in transformation header");

  if (!req.body.transformationHeader.name)
    throw new BadRequest("Name not found in transformation header");

  //Check if there is specified tags for this transformation
  if (req.body.transformationHeader.tags)
    if (req.body.transformationHeader.tags.length > 0)
      req.body.transformationHeader.tags = await checkValidAndDuplicateTags(
        req.body.transformationHeader.tags
      );
    else req.body.transformationHeader.tags = [];

  const handler = handlers[req.body.transformationHeader.type];
  if (handler == undefined)
    throw new NotFound("Transformation type is invalid");

  await handler(req, res);
};

module.exports = transformationHandler;
