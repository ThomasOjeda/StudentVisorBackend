const { BadRequest, NotFound } = require("../../errors/errors-index");

const handlers = {
  "st-mv": require("./transformation-handlers/transform-movements-handler"),
  "insc": require("./transformation-handlers/transform-inscriptions-handler"),
};

const transformationHandler = async (req, res) => {

  if (!req.body.transformation)
    throw new BadRequest("Transformation object not found in request");

  if (!req.body.transformation.type)
    throw new BadRequest("Type not found in transformation");

  if (!req.body.transformation.name)
    throw new BadRequest("Name not found in transformation");

  const handler = handlers[req.body.transformation.type];
  if (handler == undefined)
    throw new NotFound("Transformation type is invalid");

  await handler(req, res);
};

module.exports = transformationHandler;
