const express = require("express");

const {
  getAllCharts,
  getChart,
  updateChart,
  createChart,
  deleteChart,
  deleteAllCharts,
} = require("../../controllers/master/chart");

const chartsMasterRouter = express.Router();

chartsMasterRouter.get("/" ,getAllCharts);
chartsMasterRouter.get("/:id", getChart);
chartsMasterRouter.post("/", createChart);
chartsMasterRouter.patch("/:id", updateChart);
chartsMasterRouter.delete("/:id",deleteChart)
chartsMasterRouter.delete("/",deleteAllCharts)

module.exports = { chartsMasterRouter };
