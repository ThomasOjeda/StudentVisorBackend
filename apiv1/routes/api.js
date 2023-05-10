const express = require("express");

const chartsRouter = require("./chart");
const usersRouter = require("./user");
const uploadsRouter = require("../../apimaster/routes/upload");
const transformationsRouter = require("../../apimaster/routes/transformation");
const studentFilesMetadataRouter = require("./student-file-metadata");
const authRouter = require("./auth");
const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");

const router = express.Router();

router.use("/charts", authentication, chartsRouter);
router.use("/users", authentication, authorization("admin"), usersRouter);
router.use("/uploads", authentication, authorization("admin"), uploadsRouter); ///TEST THEM FROM HERE
router.use(
  "/transformations",
  authentication,
  authorization("admin"),
  transformationsRouter
);
router.use(
  "/studentfiles",
  authentication,
  authorization("admin"),
  studentFilesMetadataRouter
);
router.use("/auth", authRouter);

module.exports = router;
