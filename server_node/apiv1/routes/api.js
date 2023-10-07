const express = require("express");

const chartsRouter = require("./chart");
const usersRouter = require("./user");
const uploadsRouter = require("../../apimaster/routes/upload");
const transformationsRouter = require("../../apimaster/routes/transformation");
const studentFilesMetadataRouter = require("./student-file-metadata");
const authRouter = require("./auth");
const tagsRouter = require("./tag");
const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");
const dataCategoriesRouter = require("../../apimaster/routes/data-categories");

const router = express.Router();

router.use("/charts", authentication, chartsRouter);
router.use("/users", authentication, usersRouter);
router.use("/uploads", authentication, authorization("admin"), uploadsRouter);
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
router.use("/tags", authentication, authorization("admin"), tagsRouter);
router.use("/auth", authRouter);
router.use("/datacat", dataCategoriesRouter);

module.exports = router;
