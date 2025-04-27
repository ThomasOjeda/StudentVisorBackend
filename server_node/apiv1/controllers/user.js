const user = require("../../models/user");
const { StatusCodes } = require("http-status-codes");
const { NotFound, Unauthorized } = require("../../errors/errors-index");
const checkValidAndDuplicateTags = require("../../utils/check-valid-and-duplicate-tags");

const getOtherUsers = async (req, res) => {
  const resultUsers = await user.find(
    { email: { $ne: req.userData.email } },
    "-password"
  );
  res
    .status(StatusCodes.OK)
    .json({ success: true, result: resultUsers, nHits: resultUsers.length });
};

const getAllUsers = async (req, res) => {
  const resultUsers = await user.find({}, "-password");
  res
    .status(StatusCodes.OK)
    .json({ success: true, result: resultUsers, nHits: resultUsers.length });
};

const getUser = async (req, res) => {
  const { id: userId } = req.params;
  let resultUser = await user.findOne({ _id: userId }, "-password");
  if (!resultUser) throw new NotFound(`No user with id : ${userId}`);
  res.status(StatusCodes.OK).json({ success: true, result: resultUser });
};

const getMyUser = async (req, res) => {
  let resultUser = await user.findOne(
    { email: req.userData.email },
    "-password"
  );
  if (!resultUser) throw new Unauthorized("Unauthorized");
  res.status(StatusCodes.OK).json({ success: true, result: resultUser });
};

const updateUser = async (req, res) => {
  const { id: userId } = req.params;
  let updatedUser = {};
  if (req.body.username) updatedUser.username = req.body.username;
  if (req.body.role) updatedUser.role = req.body.role;
  if (req.body.tags) updatedUser.tags = await checkValidAndDuplicateTags(req.body.tags);

  const resultUser = await user.findOneAndUpdate({ _id: userId }, updatedUser, {
    fields: "-password",
    new: true,
    runValidators: true,
  });
  if (!resultUser) throw new NotFound(`No user with id : ${userId}`);
  res.status(StatusCodes.OK).json({ success: true, result: resultUser });
};

const updateMyUser = async (req, res) => {
  let updatedUser = {};
  if (req.body.username) updatedUser.username = req.body.username;
  if (req.body.role) updatedUser.role = req.body.role;
  if (req.body.tags) updatedUser.tags = await checkValidAndDuplicateTags(req.body.tags);

  const resultUser = await user.findOneAndUpdate(
    { email: req.userData.email },
    updatedUser,
    {
      fields: "-password",
      new: true,
      runValidators: true,
    }
  );
  if (!resultUser) throw new Unauthorized("Unauthorized");
  res.status(StatusCodes.OK).json({ success: true, result: resultUser });
};

//This safe deletion checks if the user being deleted is not the requesting user.
const safeDeleteUser = async (req, res) => {
  const { id: userId } = req.params;
  let result = await user.deleteOne({
    _id: userId,
    email: { $ne: req.userData.email },
  });

  if (result.deletedCount <= 0)
    throw new NotFound(
      `No user with id : ${userId}, or trying to delete your own user`
    );
  res.status(StatusCodes.OK).json({ success: true });
};

//This deletion can erase the requesting user data.
const deleteUser = async (req, res) => {
  const { id: userId } = req.params;
  let result = await user.deleteOne({ _id: userId });

  if (result.deletedCount <= 0)
    throw new NotFound(`No user with id : ${userId}`);
  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = {
  getOtherUsers,
  getAllUsers,
  getUser,
  getMyUser,
  updateUser,
  updateMyUser,
  safeDeleteUser,
  deleteUser,
};
