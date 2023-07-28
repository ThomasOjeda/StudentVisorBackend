const chart = require("../../../models/chart");

const storeChart = async (req, res, next) => {
  let newChart = await chart.create(req.chartObject);
  req.chartObject = newChart;
  next();
};

module.exports = storeChart;
