const { Unauthorized } = require("../../errors/errors-index");
const user = require("../../models/user");

const authorization = (role) => {
  return async (req, res, next) => {
    try {
      result = await user.findOne({ email: req.userData.email });
      if (result.role !== role) throw new Unauthorized("Unauthorized");
    } catch (error) {
      throw new Unauthorized("Unauthorized");
    }

    next();
  };
};

module.exports = authorization;
