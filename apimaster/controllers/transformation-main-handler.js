const { BadRequest, NotFound } = require("../../errors/errors-index");
const TransformationType = require("../../models/transformation-types");
const tagDB = require("../../models/tag");

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

  if (!req.body.transformationHeader.tags || req.body.transformationHeader.tags.length <= 0) {
    req.body.transformationHeader.tags = ["PUBLIC"];
  } else {
    //Check if tags are valid
    for (const tag of req.body.transformationHeader.tags) {
      if (!(await tagDB.findOne({ _id: tag })))
        throw new NotFound(`No tag with value : ${tag}`);
    }
    //Filter duplicates
    req.body.transformationHeader.tags = req.body.transformationHeader.tags.filter(
      (tag, index) => req.body.transformationHeader.tags.indexOf(tag) === index
    );
  }

  const handler = handlers[req.body.transformationHeader.type];
  if (handler == undefined)
    throw new NotFound("Transformation type is invalid");

  await handler(req, res);
};

module.exports = transformationHandler;
