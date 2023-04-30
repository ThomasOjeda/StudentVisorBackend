const express = require("express");

const {
  getAllCharts,
  getChart,
  updateChart,
  createChart,
  deleteChart,
  deleteAllCharts,
} = require("../controllers/chart");

const chartsRouter = express.Router();

chartsRouter.get("/" ,getAllCharts);
chartsRouter.get("/:id", getChart);
chartsRouter.post("/", createChart);
chartsRouter.patch("/:id", updateChart);
chartsRouter.delete("/:id",deleteChart)
chartsRouter.delete("/",deleteAllCharts)

module.exports = { chartsRouter };
