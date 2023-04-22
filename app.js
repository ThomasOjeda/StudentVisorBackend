const connectDB = require("./db/connect");
const express = require("express");
require("dotenv").config();
require("express-async-errors");
const apiRouter = require("./routes/api");
const masterRouter = require("./routes/master/masterRouter")
const notFound = require("./controllers/not-found");
const errorHandler = require("./middleware/error-handler");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", apiRouter);
app.use("/master", masterRouter)

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`server listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
