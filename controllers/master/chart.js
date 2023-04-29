const chart = require("../../models/chart");
const studentFileMetadata = require("../../models/student-file-metadata")
const { NotFound, BadRequest } = require("../../errors/errors-index");
const { StatusCodes } = require("http-status-codes");
const { PythonShell } = require("python-shell");

const getAllCharts = async (req, res) => {
  resultCharts = await chart.find({});
  res
    .status(StatusCodes.OK)
    .json({ success: true, result: resultCharts, nHits: resultCharts.length});
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

const transformData = async (req,res) => {


  let pythonCallOptions = {
    mode: 'text',
    args: [JSON.stringify(req.body.transformation)]
  };

  try {
    result = (await PythonShell.run('data_transformation/data-transformation.py', pythonCallOptions))[0]
    res.status(StatusCodes.CREATED).json({success: true, message: result})

  } catch (error) {
    throw new BadRequest(error)
  }


}

module.exports = {
  getAllCharts,
  getChart,
  updateChart,
  createChart,
  deleteChart,
  deleteAllCharts,
  transformData
};
