const express = require("express");

const transformationHandler = require("../controllers/transformation-main-handler");

const transformationsMasterRouter = express.Router();

transformationsMasterRouter.post("/", transformationHandler);

module.exports = { transformationsMasterRouter };
