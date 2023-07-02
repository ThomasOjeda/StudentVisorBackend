const { MONGO_URI, PORT } = require("./config/config");
const connectDB = require("./db/connect");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("express-async-errors");
const apiRouter = require("./apiv1/routes/api");
const masterRouter = require("./apimaster/routes/masterRouter");
const resourceNotFound = require("./resource-not-found");
const errorHandler = require("./error-handler");
const masterAuthentication = require("./apimaster/middleware/master-authentication");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("dist/student-visor-frontend"));

app.use("/api/v1", apiRouter);
app.use("/master", masterAuthentication, masterRouter);

app.use(resourceNotFound);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB(MONGO_URI);
    app.listen(PORT, () => {
      console.log(`server listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
