const express = require("express");

const authorization = require("../middleware/authorization");
const adminChartRouter = require("./chart/admin");
const readerChartRouter = require("./chart/reader");
const chartsRouter = express.Router();

chartsRouter.use("/admin", authorization("admin"), adminChartRouter);

//peligroso que el admin pueda borrar todo
chartsRouter.use("/reader", authorization("reader"), readerChartRouter);

module.exports = chartsRouter;
