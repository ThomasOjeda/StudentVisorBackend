const express = require("express");

const {
  getAllTags,
  getTag,
  createTag,
  updateTag,
  deleteTag,
  deleteAllTags,
} = require("../../apimaster/controllers/tag");

const tagsRouter = express.Router();

tagsRouter.get("/", getAllTags);
tagsRouter.get("/:id", getTag);
tagsRouter.post("/", createTag);
tagsRouter.patch("/:id", updateTag);
tagsRouter.delete("/:id", deleteTag);
tagsRouter.delete("/", deleteAllTags);

module.exports = tagsRouter;
