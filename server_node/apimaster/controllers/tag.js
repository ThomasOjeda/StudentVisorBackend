const tag = require("../../models/tag");
const chart = require("../../models/chart");
const user = require("../../models/user");

const { NotFound, BadRequest } = require("../../errors/errors-index");
const { StatusCodes } = require("http-status-codes");

const getAllTags = async (req, res) => {
  resultTags = await tag.find({});
  res
    .status(StatusCodes.OK)
    .json({ success: true, result: resultTags, nHits: resultTags.length });
};

const getTag = async (req, res) => {
  const { id: tagId } = req.params;
  resultTag = await tag.findOne({ _id: tagId });
  if (!resultTag) throw new NotFound(`No tag with value : ${tagId}`);
  res.status(StatusCodes.OK).json({ success: true, result: resultTag });
};

const updateTag = async (req, res) => {
  const { id: tagId } = req.params;
  const resultTag = await tag.findOneAndUpdate({ _id: tagId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!resultTag) throw new NotFound(`No tag with id : ${tagId}`);
  res.status(StatusCodes.OK).json({ success: true, result: resultTag });
};

const createTag = async (req, res) => {
  created = await tag.create(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, result: created });
};

const deleteTag = async (req, res) => {
  const { id: tagId } = req.params;
  result = await tag.deleteOne({ _id: tagId });

  if (result.deletedCount <= 0) throw new NotFound(`No tag with id : ${tagId}`);
  res.status(StatusCodes.OK).json({ success: true });
};

//This delete checks if the tag is being used in any chart or user before deleting it
const consistentDeleteTag = async (req, res) => {
  const { id: tagId } = req.params;

  const c = await chart.findOne({ tags: tagId });
  if (c) {
    throw new BadRequest(`The tag is in use by chart ${c._id}`);
  }

  const u = await user.findOne({ tags: tagId });
  if (u) {
    throw new BadRequest(`The tag is in use by user ${u._id}`);
  }

  result = await tag.deleteOne({ _id: tagId });

  if (result.deletedCount <= 0) throw new NotFound(`No tag with id : ${tagId}`);
  res.status(StatusCodes.OK).json({ success: true });
};

const deleteAllTags = async (req, res) => {
  result = await tag.deleteMany({});

  res
    .status(StatusCodes.OK)
    .json({ success: true, nHits: result.deletedCount });
};

module.exports = {
  getAllTags,
  getTag,
  updateTag,
  createTag,
  deleteTag,
  consistentDeleteTag,
  deleteAllTags,
};
