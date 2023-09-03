const createChartObject = async (req, res, next) => {
  req.chartObject = {
    name: req.body.transformationHeader.name,
    description: req.body.transformationHeader.description,
    type: req.body.transformationHeader.type,
    tags: req.body.transformationHeader.tags,
    structure: req.body.calculatedResult,
  };

  next();
};

module.exports = createChartObject;
