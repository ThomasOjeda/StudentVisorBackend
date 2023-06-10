const express = require("express");

const { getAllCharts, getChart } = require("../../controllers/chart/reader");

const readerChartRouter = express.Router();

readerChartRouter.get("/", getAllCharts);
readerChartRouter.get("/:id", getChart);

module.exports = readerChartRouter;
