const chart = require("../../models/chart");
const { NotFound } = require("../../errors/errors-index");
const { StatusCodes } = require("http-status-codes");
const checkValidAndDuplicateTags = require("../../utils/check-valid-and-duplicate-tags");

const getAllCharts = async (req, res) => {
  resultCharts = await chart.find({});
  res
    .status(StatusCodes.OK)
    .json({ success: true, result: resultCharts, nHits: resultCharts.length });
};

const getChart = async (req, res) => {
  const { id: chartId } = req.params;
  resultChart = await chart.findOne({ _id: chartId });
  if (!resultChart) throw new NotFound(`No chart with id : ${chartId}`);
  res.status(StatusCodes.OK).json({ success: true, result: resultChart });
};

const updateChart = async (req, res) => {
  const { id: chartId } = req.params;
  const updated = {};
  if (req.body.name) updated.name = req.body.name;
  if (req.body.tags) updated.tags = req.body.tags;
  const resultChart = await chart.findOneAndUpdate({ _id: chartId }, updated, {
    new: true,
    runValidators: true,
  });
  if (!resultChart) throw new NotFound(`No chart with id : ${chartId}`);
  res.status(StatusCodes.OK).json({ success: true, result: resultChart });
};

//This update checks if the provided tags are valid and eliminates duplicates
const consistentUpdateChart = async (req, res) => {
  const { id: chartId } = req.params;
  const updated = {};
  if (req.body.name) updated.name = req.body.name;
  if (req.body.tags) updated.tags = await checkValidAndDuplicateTags(req.body.tags, false);

  const resultChart = await chart.findOneAndUpdate({ _id: chartId }, updated, {
    new: true,
    runValidators: true,
  });
  if (!resultChart) throw new NotFound(`No chart with id : ${chartId}`);
  res.status(StatusCodes.OK).json({ success: true, result: resultChart });
};

const createChart = async (req, res) => {
  created = await chart.create(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, result: created });
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
  consistentUpdateChart,
  createChart,
  deleteChart,
  deleteAllCharts,
};
