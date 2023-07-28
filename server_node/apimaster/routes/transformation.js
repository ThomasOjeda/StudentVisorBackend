const express = require("express");

const transformationHandler = require("../controllers/transformation-main-handler");

const checkTags = require("../middleware/transformations-middleware/check-tags");
const storeChart = require("../middleware/transformations-middleware/store-chart");
const sendChart = require("../middleware/transformations-middleware/send-chart");
const createChartObject = require("../middleware/transformations-middleware/create-chart-object");

const transformationsMasterRouter = express.Router();

transformationsMasterRouter.post(
  "/",
  checkTags,
  transformationHandler,
  createChartObject,
  storeChart,
  sendChart
);
transformationsMasterRouter.post(
  "/pre",
  transformationHandler,
  createChartObject,
  sendChart
);

module.exports = transformationsMasterRouter;
