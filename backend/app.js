require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const usersRouter = require("./routes/userRoutes");

const app = express();

const port = process.env.PORT || 8080;
const mongoDBUri = process.env.MONGO_URI;

// middleware
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// routes
app.use("/api/users", usersRouter);

mongoose.connect(
  mongoDBUri,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err) => {
    if (err) return console.log(err);
    console.log("Successfully connected to the database.");
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  }
);
