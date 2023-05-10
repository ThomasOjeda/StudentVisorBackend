const express = require("express");

const {
    getAllCharts,
    getChart,
    updateChart,
    deleteChart,
    deleteAllCharts,

} = require("../../controllers/chart/admin")

const adminChartRouter = express.Router();

adminChartRouter.get("/",getAllCharts);

adminChartRouter.get("/:id", getChart);

adminChartRouter.patch("/:id", updateChart)

adminChartRouter.delete("/:id",deleteChart)

//peligroso que el admin pueda borrar todo
adminChartRouter.delete("/",deleteAllCharts)

module.exports = adminChartRouter;
