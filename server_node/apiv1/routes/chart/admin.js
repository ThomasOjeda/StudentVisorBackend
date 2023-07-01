const express = require("express");

const {
  getAllCharts,
  getChart,
  deleteChart,
  deleteAllCharts,
  consistentUpdateChart,
} = require("../../../apimaster/controllers/chart");

const adminChartRouter = express.Router();

adminChartRouter.get("/", getAllCharts);
adminChartRouter.get("/:id", getChart);
adminChartRouter.patch("/:id", consistentUpdateChart);
adminChartRouter.delete("/:id", deleteChart);
//The admin can delete all the charts, ******_____DANGEROUS_____*****//
adminChartRouter.delete("/", deleteAllCharts);

module.exports = adminChartRouter;
