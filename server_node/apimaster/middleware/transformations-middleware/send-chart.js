const { StatusCodes } = require("http-status-codes");

const sendChart = (req, res) => {
  res
    .status(StatusCodes.CREATED)
    .json({ structure: req.body.calculatedResult });
};

module.exports = sendChart;
