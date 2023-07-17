const chart = require("../../../models/chart");

const storeChart = async (req, res, next) => {
  await chart.create({
    name: req.body.transformationHeader.name,
    type: req.body.transformationHeader.type,
    tags: req.body.transformationHeader.tags,
    structure: req.body.calculatedResult,
  });
  next();
};

module.exports = storeChart;
