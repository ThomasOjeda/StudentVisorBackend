const express = require("express");
const {
  getUnits,
  getUnitOffers,
  getAllGenders,
} = require("../controllers/data-categories");

const dataCategoriesMasterRouter = express.Router();

dataCategoriesMasterRouter.post("/units", getUnits);
dataCategoriesMasterRouter.post("/unitoffers", getUnitOffers);
dataCategoriesMasterRouter.get("/genders", getAllGenders);

module.exports = dataCategoriesMasterRouter;
