const express = require("express");

const {
  getAllTags,
  getTag,
  createTag,
  updateTag,
  consistentDeleteTag,
} = require("../../apimaster/controllers/tag");

const tagsRouter = express.Router();

tagsRouter.get("/", getAllTags);
tagsRouter.get("/:id", getTag);
tagsRouter.post("/", createTag);
tagsRouter.patch("/:id", updateTag);
tagsRouter.delete("/:id", consistentDeleteTag);

module.exports = tagsRouter;
