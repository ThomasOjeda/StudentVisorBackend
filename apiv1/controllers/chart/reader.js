const user = require("../../../models/user")
const chart = require("../../../models/chart")
const { StatusCodes } = require("http-status-codes")
const { NotFound } = require("../../../errors/errors-index")

const getAllCharts = async (req, res) => {
  const userData = await user.findOne({ email: req.userData.email });
  if (!userData) throw new NotFound("The requested resource was not found");

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
  const resultChart = await chart.findOne({ _id: chartId });
  if (!resultChart) throw new NotFound("The requested chart was not found");
  
  const userData = await user.findOne({ email: req.userData.email });
  if (!userData) throw new NotFound("The requested chart was not found");

  console.log(userData.tags.filter(value => resultChart.tags.includes(value)))
  if (userData.tags.filter(value => resultChart.tags.includes(value)).length <= 0)
    throw new NotFound("The requested chart was not found");

  res.status(StatusCodes.OK).json({ success: true, result: resultChart });
};

module.exports = { getAllCharts, getChart };