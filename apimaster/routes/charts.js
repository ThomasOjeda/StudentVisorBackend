const express = require("express");

const {
  getAllCharts,
  getChart,
  updateChart,
  createChart,
  deleteChart,
  deleteAllCharts,
} = require("../controllers/chart");

const transformationHandler = require("../controllers/transformation-main-handler")

const chartsMasterRouter = express.Router();

chartsMasterRouter.post("/transform", transformationHandler);

chartsMasterRouter.get("/", getAllCharts);
chartsMasterRouter.get("/:id", getChart);
chartsMasterRouter.post("/", createChart);
chartsMasterRouter.patch("/:id", updateChart);
chartsMasterRouter.delete("/:id", deleteChart);
chartsMasterRouter.delete("/", deleteAllCharts);

module.exports = { chartsMasterRouter };
