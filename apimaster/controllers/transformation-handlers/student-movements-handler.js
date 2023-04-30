const { StatusCodes } = require("http-status-codes")
const { BadRequest } = require("../../../errors/errors-index");

const studentMovementsHandler = (req, res) => {
  if (!req.body.transformation.yearA || !req.body.transformation.yearB)
    throw new BadRequest("Transformation object is malformed");
  res.status(StatusCodes.CREATED).send();
};

module.exports = studentMovementsHandler;
