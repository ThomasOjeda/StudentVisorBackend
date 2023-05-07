const getAllCharts = async (req, res) => {
  const userData = await user.findOne({ email: req.userData.email });
  if (!userData) throw NotFound("The requested resource was not found");

  const userTags = userData.tags;
  let requestedCharts = [];

  for (const tag of userTags) {
    //PODRIA HACERSE DE OTRA MANERA CON UNA FUNCION DE MONGO?
    result = await chart.find({ tags: tag });

    for (el of result) {
      if (
        requestedCharts.findIndex((c) => {
          return c._id.equals(el._id);
        }) <= -1
      )
        requestedCharts.push(el);
    }
  }

  res.status(StatusCodes.OK).json({
    success: true,
    result: requestedCharts,
    nHits: requestedCharts.length,
  });
};

const getChart = async (req, res) => {
  const { id: chartId } = req.params;
  resultChart = await chart.findOne({ _id: chartId });
  if (!resultChart) throw new NotFound(`No chart with id : ${chartId}`);
  res.status(StatusCodes.OK).json({ success: true, result: resultChart });
};

const updateChart = async (req, res) => {
  const { id: chartId } = req.params;
  const resultChart = await chart.findOneAndUpdate({ _id: chartId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!resultChart) throw new NotFound(`No chart with id : ${chartId}`);
  res.status(StatusCodes.OK).json({ success: true, result: resultChart });
};

const deleteChart = async (req, res) => {
  const { id: chartId } = req.params;
  result = await chart.deleteOne({ _id: chartId });

  if (result.deletedCount <= 0)
    throw new NotFound(`No chart with id : ${chartId}`);
  res.status(StatusCodes.OK).json({ success: true });
};

const deleteAllCharts = async (req, res) => {
  result = await chart.deleteMany({});

  res
    .status(StatusCodes.OK)
    .json({ success: true, nHits: result.deletedCount });
};

module.exports = {
  getAllCharts,
  getChart,
  updateChart,
  deleteChart,
  deleteAllCharts,
};
