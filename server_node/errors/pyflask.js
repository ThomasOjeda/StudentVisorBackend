const CustomAPIError = require("./custom-error");
const { StatusCodes } = require("http-status-codes");

class PyflaskError extends CustomAPIError {
  constructor(message) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

module.exports = PyflaskError;
