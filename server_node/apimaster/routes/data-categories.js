const express = require("express");
const {
  getUnits,
  getUnitOffers,
  getAllGenders,
  getFileTypes,
} = require("../controllers/data-categories");

const dataCategoriesMasterRouter = express.Router();

dataCategoriesMasterRouter.post("/units", getUnits);
dataCategoriesMasterRouter.post("/unitoffers", getUnitOffers);
dataCategoriesMasterRouter.get("/genders", getAllGenders);
dataCategoriesMasterRouter.post("/filetypes", getFileTypes);

module.exports = dataCategoriesMasterRouter;
