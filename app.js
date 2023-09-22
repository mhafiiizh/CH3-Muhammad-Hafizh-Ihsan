// Core Module
const http = require("http");
const fs = require("fs");

// Third Party Module
const express = require("express");
const morgan = require("morgan");

// Local Module
const carRouter = require("./routes/carsRoutes");

const app = express();

// Middleware express
// Memodifikasi
app.use(express.json());
app.use(morgan("dev"));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1", carRouter);

module.exports = app;
