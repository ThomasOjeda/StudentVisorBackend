const express = require("express");

const transformationHandler = require("../controllers/transformation-main-handler");

const checkTags = require("../middleware/transformations-middleware/check-tags");
const storeChart = require("../middleware/transformations-middleware/store-chart");
const sendChart = require("../middleware/transformations-middleware/send-chart");

const transformationsMasterRouter = express.Router();

transformationsMasterRouter.post(
  "/",
  checkTags,
  transformationHandler,
  storeChart,
  sendChart
);
transformationsMasterRouter.post("/pre", transformationHandler, sendChart);

module.exports = transformationsMasterRouter;
