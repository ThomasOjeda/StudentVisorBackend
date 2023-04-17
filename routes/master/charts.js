const express = require("express");
const {spawn} = require('child_process');
const path = require('path')
const {
  getAllCharts,
  getChart,
  updateChart,
  createChart,
  deleteChart,
  deleteAllCharts,
} = require("../../controllers/master/chart");


const chartsMasterRouter = express.Router();

const testpython = (req, res) => {

  var dataToSend;
  // spawn new child process to call the python script
  const python = spawn("python", ['C:/Users/Fanat/Escritorio/StudentVisorBackend/data_transformation/transformations/student_movements/studentMovements.py']);
  // collect data from script
  python.stdout.on("data", function (data) {

    console.log("Pipe data from python script ...");
    dataToSend = data.toString();
  });
  // in close event we are sure that stream from child process is closed
  python.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    res.send(dataToSend);
  });
};
chartsMasterRouter.get("/testpy",testpython);

chartsMasterRouter.get("/", getAllCharts);
chartsMasterRouter.get("/:id", getChart);
chartsMasterRouter.post("/", createChart);
chartsMasterRouter.patch("/:id", updateChart);
chartsMasterRouter.delete("/:id", deleteChart);
chartsMasterRouter.delete("/", deleteAllCharts);



module.exports = { chartsMasterRouter };
