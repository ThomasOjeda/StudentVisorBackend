const { MONGO_URI, PORT, PYFLASK_URL } = require("./config/config");
const connectDB = require("./db/connect");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
require("express-async-errors");
const apiRouter = require("./apiv1/routes/api");
const masterRouter = require("./apimaster/routes/masterRouter");
const resourceNotFound = require("./resource-not-found");
const errorHandler = require("./error-handler");
const masterAuthentication = require("./apimaster/middleware/master-authentication");
const createDataFolders = require("./utils/create-data-folders");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("dist/student-visor-frontend"));

app.use("/api/v1", apiRouter);
app.use("/master", masterAuthentication, masterRouter);

app.use(resourceNotFound);
app.use(errorHandler);

const mongoRetryConnection = async () => {
  try {
    await connectDB(MONGO_URI);
  } catch (error) {
    console.log("Mongo connection failed, waiting 10sec before retrying...");
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await mongoRetryConnection();
  }
};

const pyflaskRetryConnection = async () => {
  try {
    response = await axios.get(PYFLASK_URL);
  } catch (error) {
    console.log("Pyflask connection failed, waiting 10sec before retrying...");
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await pyflaskRetryConnection();
  }
};

const start = async () => {
  console.log("Waiting 0.5sec before starting server...");
  await new Promise((resolve) => setTimeout(resolve, 500));
  try {
    await createDataFolders();
  } catch (err) {
    console.log(
      "Initial folder creation failed, server may not work properly..."
    );
    console.log(err);
  }
  await mongoRetryConnection();
  await pyflaskRetryConnection();
  app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
  });
};

start();
