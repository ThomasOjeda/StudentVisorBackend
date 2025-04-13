const tag = require("../../models/tag");
const chart = require("../../models/chart");
const user = require("../../models/user");

const { NotFound, BadRequest } = require("../../errors/errors-index");
const { StatusCodes } = require("http-status-codes");
const { DEFAULT_TAGS } = require("../../utils/default-tags");

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

//Only the description of the tag can be updated (Mongo does not allow modification of document _id)
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

//This delete also prevents the DEFAULT tags from being deleted
const deleteTag = async (req, res) => {
  const { id: tagId } = req.params;

  checkDefaultTagDeletion(tagId);

  result = await tag.deleteOne({ _id: tagId });

  if (result.deletedCount <= 0)
    throw new NotFound(
      `No tag with id : ${tagId}.`
    );
  res.status(StatusCodes.OK).json({ success: true });
};

//This delete also prevents the DEFAULT tags from being deleted
//This delete checks if the tag is being used in any chart or user before deleting it
const consistentDeleteTag = async (req, res) => {
  const { id: tagId } = req.params;

  checkDefaultTagDeletion(tagId);

  const c = await chart.findOne({ tags: tagId });
  if (c) {
    throw new BadRequest(`The tag is in use by chart ${c._id}`);
  }

  const u = await user.findOne({ tags: tagId });
  if (u) {
    throw new BadRequest(`The tag is in use by user ${u._id}`);
  }

  result = await tag.deleteOne({ _id: tagId });

  if (result.deletedCount <= 0)
    throw new NotFound(
      `No tag with id : ${tagId}.`
    );
  res.status(StatusCodes.OK).json({ success: true });
};

//This delete also prevents the DEFAULT tags from being deleted
const deleteAllTags = async (req, res) => {

  //The mongodb operation of deletion should delete all tags except the default ones
  //This is done by using the deleteMany function with a filter
  const result = await tag.deleteMany({
    _id: { $nin: Object.keys(DEFAULT_TAGS) },
  });

  res
    .status(StatusCodes.OK)
    .json({ success: true, nHits: result.deletedCount });
};

const checkDefaultTagDeletion = (tagId) => {
  if (Object.keys(DEFAULT_TAGS).includes(tagId)) {
    throw new BadRequest(
      `The tag ${tagId} is a default tag and cannot be deleted`
    );
  }
}

module.exports = {
  getAllTags,
  getTag,
  updateTag,
  createTag,
  deleteTag,
  consistentDeleteTag,
  deleteAllTags,
};
