const { StatusCodes } = require("http-status-codes");

const sendChart = (req, res) => {
  res.status(StatusCodes.CREATED).json(req.chartObject);
};

module.exports = sendChart;
