const user = require("../../models/user");
const { StatusCodes } = require("http-status-codes");
const {NotFound,BadRequest} = require('../../errors/errors-index')
const bcrypt = require("bcrypt");


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

const createUser = async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  } catch (err) {
    throw new BadRequest("Please provide a password");
  }
  created = await user.create(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, result: created });
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


const deleteAllUsers = async (req, res) => {
  result = await user.deleteMany({});
  res
    .status(StatusCodes.OK)
    .json({ success: true, nHits: result.deletedCount });
};

module.exports = { getAllUsers , getUser, createUser, updateUser, deleteUser, deleteAllUsers};
