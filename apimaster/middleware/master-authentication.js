const { MASTER_SECRET } = require("../../config/config");
const { Unauthorized, BadRequest } = require("../../errors/errors-index");
const masterAuthentication = async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  )
    throw new BadRequest("No token provided");

  const token = req.headers.authorization.split(" ")[1];

  if (MASTER_SECRET == token) next();
  else throw new Unauthorized("Unauthorized");
};

module.exports = masterAuthentication;
