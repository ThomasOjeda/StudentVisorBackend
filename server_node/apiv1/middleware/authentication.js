const { JWT_SECRET } = require("../../config/config");
const jwt = require("jsonwebtoken");
const { Unauthorized, BadRequest } = require("../../errors/errors-index");
const authentication = async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  )
    throw new BadRequest("No token provided");
  const token = req.headers.authorization.split(" ")[1];
  try {
    decodedToken = jwt.verify(token, JWT_SECRET);
    req.userData = decodedToken;
    next();
  } catch (err) {
    throw new Unauthorized("Unauthorized");
  }
};

module.exports = authentication;
