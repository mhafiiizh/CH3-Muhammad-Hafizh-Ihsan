const http = require("http");
const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const { v4: uuidv4 } = require("uuid");

const app = express();

// Middleware express
// Memodifikasi
app.use(express.json());
app.use(morgan("dev"));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const port = process.env.port || 8000;

// Read File From JSON
const cars = JSON.parse(
  fs.readFileSync(`${__dirname}/data/cars.json`, "utf-8")
);

const test = (req, res) => {
  res.status(200).json({
    message: "Ping succesfully",
  });
};

const getAllCars = (req, res) => {
  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    data: {
      cars,
    },
  });
};

const getCarById = (req, res) => {
  const id = req.params.id;
  const car = cars.find((el) => el.id === id);

  if (!car) {
    return res.status(404).json({
      status: "failed",
      message: `Data with ID = ${id} is not found`,
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      car,
    },
  });
};

const createDataCars = (req, res) => {
  // Generate ID baru
  const newId = uuidv4();
  const newData = Object.assign({ id: newId }, req.body);
  cars.push(newData);
  fs.writeFile(`${__dirname}/data/cars.json`, JSON.stringify(cars), (err) => {
    // 201 = Created
    res.status(201).json({
      status: "success",
      data: {
        cars: newData,
      },
    });
  });
};

const putDataCars = (req, res) => {
  const id = req.params.id;
  const carIndex = cars.findIndex((el) => el.id === id);

  if (carIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: `Data with ID = ${id} is not found`,
    });
  }

  cars[carIndex] = { ...cars[carIndex], ...req.body };
  fs.writeFile(`${__dirname}/data/cars.json`, JSON.stringify(cars), (err) => {
    res.status(200).json({
      status: "success",
      message: `Car with ID = ${id} is edited`,
      data: {
        cars: cars[carIndex],
      },
    });
  });
};

const deleteDataCars = (req, res) => {
  // Mencari ID dan mengonversi dari String ke Numbers
  const id = req.params.id;
  //   Mencari index ID
  //   If ID not found return -1
  const carIndex = cars.findIndex((el) => el.id === id);

  //   Validasi ID
  if (carIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: `Data with ID = ${id} is not found`,
    });
  }
  // Hapus data sesuai array
  cars.splice(carIndex, 1);
  //   Proses update di file JSON
  fs.writeFile(`${__dirname}/data/cars.json`, JSON.stringify(cars), (err) => {
    res.status(200).json({
      status: "success",
      message: `Car with ID = ${id} is deleted`,
      data: null,
    });
  });
};

const carRouter = express.Router();

carRouter.route("/").get(test);
carRouter.route("/cars").get(getAllCars).post(createDataCars);
carRouter
  .route("/cars/:id")
  .get(getCarById)
  .put(putDataCars)
  .delete(deleteDataCars);

app.use("/api/v1", carRouter);

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
