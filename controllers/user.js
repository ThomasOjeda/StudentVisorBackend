const user = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const {NotFound} = require('../errors/errors-index')

const getAllUsers = async (req, res) => {
  const resultUsers = await user.find({});
  res
    .status(StatusCodes.OK)
    .json({ success: true, result: resultUsers, nHits: resultUsers.length });
};

const getUser = async (req, res) => {
  const { id: userId } = req.params;
  resultUser = await user.findOne({ _id: userId });
  if (!resultUser)
    throw new NotFound(`No user with id : ${userId}`);
  res.status(StatusCodes.OK).json({ success: true, result: resultUser });
};


const updateUser = async (req, res) => {
  const { id: userId } = req.params;
  const resultUser = await user.findOneAndUpdate({ _id: userId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!resultUser)
    throw new NotFound(`No user with id : ${userId}`);
  res.status(StatusCodes.OK).json({ success: true, result: resultUser });
};


const deleteUser = async (req, res) => {
  const { id: userId } = req.params;
  result = await user.deleteOne({ _id: userId });
  
  if (result.deletedCount <= 0)
    throw new NotFound(`No user with id : ${userId}`);
  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = { getAllUsers , getUser, updateUser, deleteUser};
