const CustomAPIError = require("./custom-error");
const { StatusCodes } = require("http-status-codes");
class Conflict extends CustomAPIError {
  constructor(message) {
    super(message, StatusCodes.CONFLICT);
  }
}

module.exports = Conflict;
