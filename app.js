const { MONGO_URI, MONGO_PORT, PORT } = require("./config/config");
const connectDB = require("./db/connect");
const express = require("express");
require("dotenv").config();
require("express-async-errors");
const apiRouter = require("./routes/api");
const masterRouter = require("./routes/master/masterRouter")
const notFound = require("./controllers/not-found");
const errorHandler = require("./middleware/error-handler");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", apiRouter);
app.use("/master", masterRouter)

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    console.log("THIS IS THE MONGO URI")
    console.log(MONGO_URI)
    await connectDB(MONGO_URI);
    app.listen(PORT, () => {
      console.log(`server listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
