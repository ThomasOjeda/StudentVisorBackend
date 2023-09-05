const { MONGO_URI, PORT, PYFLASK_URL } = require("./config/config");
const connectDB = require("./db/connect");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const axios = require("axios");
require("dotenv").config();
require("express-async-errors");
const apiRouter = require("./apiv1/routes/api");
const masterRouter = require("./apimaster/routes/masterRouter");
const resourceNotFound = require("./resource-not-found");
const errorHandler = require("./error-handler");
const masterAuthentication = require("./apimaster/middleware/master-authentication");
const createDataFolders = require("./utils/create-data-folders");
const retry = require("./utils/retry-connection");
const startupTag = require("./utils/startup-tags");
const path = require("path");

const app = express();

//Security related middleware
app.use(helmet({ contentSecurityPolicy: false })); //--------
app.use(cors()); //----------
//-------------------------//

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("dist/student-visor-frontend"));

app.use("/api/v1", apiRouter);
app.use("/api/master", masterAuthentication, masterRouter);
app.use("/api/version", (req, res) => {
  res.status = 200;
  res.send("28-8-23_v2_v4");
});

app.use("/api", resourceNotFound);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/dist/student-visor-frontend/index.html"));
});

app.use(errorHandler);

const start = async () => {
  console.log("Waiting 0.5sec before startup tasks...");
  await new Promise((resolve) => setTimeout(resolve, 500));

  //Required folders before server startup
  await retry(
    async () => {
      await createDataFolders();
    },
    "Initial folder validation failed, waiting 10sec before retrying...(is the studentsdata folder created? try restartng the container to re-mount the volume)",
    10000
  );

  //Required connections before server startup
  await retry(
    async () => {
      await connectDB(MONGO_URI);
    },
    "Mongo connection failed, waiting 10sec before retrying...",
    10000
  );
  await retry(
    async () => {
      let response = await axios.get(PYFLASK_URL);
    },
    "Pyflask connection failed, waiting 10sec before retrying...",
    10000
  );

  //Check PUBLIC startup tag

  await startupTag();

  app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
  });
};

start();
