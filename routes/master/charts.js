const express = require("express");

const {
  getAllCharts,
  getChart,
  updateChart,
  createChart,
  deleteChart,
  deleteAllCharts,
  transformData,
} = require("../../controllers/master/chart");
const transformationValidation = require("../../middleware/transformation-validation");

const chartsMasterRouter = express.Router();

chartsMasterRouter.post("/transform", transformationValidation, transformData);

chartsMasterRouter.get("/", getAllCharts);
chartsMasterRouter.get("/:id", getChart);
chartsMasterRouter.post("/", createChart);
chartsMasterRouter.patch("/:id", updateChart);
chartsMasterRouter.delete("/:id", deleteChart);
chartsMasterRouter.delete("/", deleteAllCharts);

module.exports = { chartsMasterRouter };
