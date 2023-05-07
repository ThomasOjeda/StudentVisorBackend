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

module.exports = { getAllCharts, getChart };
