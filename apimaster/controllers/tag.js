const tag = require("../../models/tag");
const { NotFound } = require("../../errors/errors-index");
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
  deleteAllTags,
};
