const express = require("express");

const {
  getAllCharts,
  getChart,
  updateChart,
  createChart,
  deleteChart,
  deleteAllCharts,
  consistentUpdateChart,
} = require("../controllers/chart");

const chartsMasterRouter = express.Router();

chartsMasterRouter.get("/", getAllCharts);
chartsMasterRouter.get("/:id", getChart);
chartsMasterRouter.post("/", createChart);
chartsMasterRouter.patch("/inconsistent/:id", updateChart);
chartsMasterRouter.patch("/consistent/:id", consistentUpdateChart);
chartsMasterRouter.delete("/:id", deleteChart);
chartsMasterRouter.delete("/", deleteAllCharts);

module.exports = chartsMasterRouter;
