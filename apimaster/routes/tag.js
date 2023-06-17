const express = require("express");

const {
  getAllTags,
  getTag,
  createTag,
  updateTag,
  deleteTag,
  consistentDeleteTag,
  deleteAllTags,
} = require("../controllers/tag");

const tagsMasterRouter = express.Router();

tagsMasterRouter.get("/", getAllTags);
tagsMasterRouter.get("/:id", getTag);
tagsMasterRouter.post("/", createTag);
tagsMasterRouter.patch("/:id", updateTag);
tagsMasterRouter.delete("/consistent/:id", consistentDeleteTag);
tagsMasterRouter.delete("/inconsistent/:id", deleteTag);
tagsMasterRouter.delete("/", deleteAllTags);

module.exports = tagsMasterRouter;
