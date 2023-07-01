const user = require("../../../models/user");
const chart = require("../../../models/chart");
const { StatusCodes } = require("http-status-codes");
const { NotFound } = require("../../../errors/errors-index");

const getAllCharts = async (req, res) => {
  const userData = await user.findOne({ email: req.userData.email });
  if (!userData) throw new NotFound("The requested resource was not found");

  let requestedCharts = [];

  if (userData.tags && userData.tags.length > 0) {
    const userTags = userData.tags;

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
  }

  res.status(StatusCodes.OK).json({
    success: true,
    result: requestedCharts,
    nHits: requestedCharts.length,
  });
};

const getChart = async (req, res) => {
  //This function needs to check whether any tag of the chart is present in the user
  const { id: chartId } = req.params;
  const resultChart = await chart.findOne({ _id: chartId });
  if (!resultChart) throw new NotFound("The requested chart was not found");

  const userData = await user.findOne({ email: req.userData.email });
  if (!userData) throw new NotFound("The requested chart was not found");

  //Check if the user and the chart have tags
  if (!userData.tags || userData.tags.length<=0 || !resultChart.tags || resultChart.tags.length<=0)
    throw new NotFound("The requested chart was not found");

  if (
    userData.tags.filter((value) => resultChart.tags.includes(value)).length <=
    0
  )
    throw new NotFound("The requested chart was not found");

  res.status(StatusCodes.OK).json({ success: true, result: resultChart });
};

module.exports = { getAllCharts, getChart };
