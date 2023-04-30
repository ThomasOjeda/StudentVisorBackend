const { BadRequest, NotFound } = require("../../errors/errors-index");

const handlerDict = {
  "st-mv": require("./transformation-handlers/student-movements-handler"),
  "insc": require("./transformation-handlers/student-inscriptions-handler"),
};

const transformationHandler = (req, res) => {
  if (!req.body.transformation)
    throw new BadRequest("Transformation object not found in request");

  const handler = handlerDict[req.body.transformation.type];
  if (handler == undefined)
    throw new NotFound("Transformation type is non-existant");

  handler(req,res);
};

module.exports = transformationHandler;
