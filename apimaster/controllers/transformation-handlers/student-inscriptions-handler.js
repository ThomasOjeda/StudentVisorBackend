const { StatusCodes } = require("http-status-codes")
const { BadRequest } = require("../../../errors/errors-index");


const studentInscriptionsHandler = (req, res) => {
  if (!req.body.transformation.year)
    throw new BadRequest("Transformation object is malformed");
  res.status(StatusCodes.CREATED).send();
};

module.exports = studentInscriptionsHandler;
