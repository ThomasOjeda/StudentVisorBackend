const express = require("express");
const {
  getAllUnits,
  getAllGenders,
} = require("../controllers/data-categories");

const dataCategoriesMasterRouter = express.Router();

dataCategoriesMasterRouter.get("/units", getAllUnits);
dataCategoriesMasterRouter.get("/genders", getAllGenders);

module.exports = dataCategoriesMasterRouter;
