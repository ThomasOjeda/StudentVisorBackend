const { BadRequest, NotFound } = require("../../errors/errors-index");
const TransformationType = require("../../models/transformation-types");

const handlers = {
  [TransformationType.STMV]: require("./transformation-handlers/transform-movements-handler"),
  [TransformationType.INSC]: require("./transformation-handlers/transform-inscriptions-handler"),
};

const transformationHandler = async (req, res, next) => {
  if (!req.body.transformationHeader)
    throw new BadRequest("Transformation header not found in request");

  if (!req.body.transformationBody)
    throw new BadRequest("Transformation body not found in request");

  if (!req.body.transformationHeader.type)
    throw new BadRequest("Type not found in transformation header");

  if (!req.body.transformationHeader.name)
    throw new BadRequest("Name not found in transformation header");

  const handler = handlers[req.body.transformationHeader.type];
  if (handler == undefined)
    throw new NotFound("Transformation type is invalid");

  await handler(req, res, next);
};

module.exports = transformationHandler;
