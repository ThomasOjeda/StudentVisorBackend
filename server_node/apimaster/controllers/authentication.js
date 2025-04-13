const user = require("../../models/user");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequest,
  Unauthorized,
  Conflict,
} = require("../../errors/errors-index");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkValidAndDuplicateTags = require("../../utils/check-valid-and-duplicate-tags");

const login = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    throw new BadRequest("Please provide email and password");
  }
  userInfo = await user.findOne({ email: req.body.email });
  if (!userInfo)
    throw new Unauthorized("Please provide a valid email and password");

  let authorized = false;
  try {
    authorized = await bcrypt.compare(req.body.password, userInfo.password);
  } catch (err) {
    throw new Unauthorized("Authentication failed");
  }

  if (!authorized)
    throw new Unauthorized("Please provide a valid email and password");

  let token;

  try {
    token = await jwt.sign(
      {
        email: userInfo.email,
        username: userInfo.username,
        role: userInfo.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );
  } catch (err) {
    throw new Unauthorized("Authentication failed");
  }

  res
    .status(StatusCodes.OK)
    .json({ success: true, token: token, role: userInfo.role });
};

const register = async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  } catch (err) {
    throw new BadRequest("Please provide a password");
  }

  req.body.tags = await checkValidAndDuplicateTags(req.body.tags);

  userWithSameEmail = await user.findOne({ email: req.body.email });
  if (userWithSameEmail) {
    throw new Conflict("Email already in use");
  }

  created = await user.create(req.body);
  res.status(StatusCodes.CREATED).json({ success: true });
};

module.exports = { login, register };
