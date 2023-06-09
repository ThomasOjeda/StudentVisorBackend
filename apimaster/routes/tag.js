const express = require("express");

const {
  getAllTags,
  getTag,
  createTag,
  updateTag,
  deleteTag,
  deleteAllTags,
} = require("../controllers/tag");

const tagsMasterRouter = express.Router();

tagsMasterRouter.get("/", getAllTags);
tagsMasterRouter.get("/:id", getTag);
tagsMasterRouter.post("/", createTag);
tagsMasterRouter.patch("/:id", updateTag);
tagsMasterRouter.delete("/:id", deleteTag);
tagsMasterRouter.delete("/", deleteAllTags);

module.exports = tagsMasterRouter;
