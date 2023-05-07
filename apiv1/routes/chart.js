const express = require("express");

const authorization = require("../middleware/authorization");
const adminChartRouter = require("./chart/admin");
const userChartRouter = require("./chart/user");
const chartsRouter = express.Router();

chartsRouter.use("/admin", authorization("admin"), adminChartRouter);

//peligroso que el admin pueda borrar todo
chartsRouter.use("/user", authorization("user"), userChartRouter);

module.exports = chartsRouter;
