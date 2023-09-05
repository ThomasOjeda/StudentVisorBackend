const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  responseError = {
    status: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong",
  };

  if (err.name && (err.name == "ValidationError" || err.name == "CastError")) {
    responseError.status = StatusCodes.BAD_REQUEST;
    responseError.msg = err.message;
  }

  return res.status(responseError.status).json(responseError.msg);
};

module.exports = errorHandler;
