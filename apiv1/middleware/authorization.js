const { Unauthorized, BadRequest } = require("../../errors/errors-index");

const authorization = (role) => {
  return async (req, res, next) => {
    console.log(req.userData.email)
    console.log(role)
    next();
  };
};

module.exports = authorization;
