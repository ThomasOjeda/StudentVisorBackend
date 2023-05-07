const express = require("express");

const authorization = require("../../middleware/authorization");

const { getAllCharts, getChart } = require("../../controllers/chart/user");

const userChartRouter = express.Router();

userChartRouter.get("/", authorization("user"), getAllCharts);

userChartRouter.get("/:id", authorization("user"), getChart);

module.exports = userChartRouter;
