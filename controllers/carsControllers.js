const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Read File From JSON
const cars = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/cars.json`, "utf-8")
);

const checkId = (req, res, next, val) => {
  const car = cars.find((el) => el.id === val);

  if (!car) {
    return res.status(404).json({
      status: "failed",
      message: `Data with ID = ${val} is not found`,
    });
  }
  next();
};

const checkBody = (req, res, next) => {
  const { plate, manufacture, model, available, year } = req.body;
  if (!plate && !manufacture && !model && !available && !year) {
    return res.status(400).json({
      status: "failed",
      message:
        "Plate, Manufacture, Model, Available, and Year are all required fields.",
    });
  }
  next();
};

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
  fs.writeFile(
    `${__dirname}/../data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      // 201 = Created
      res.status(201).json({
        status: "success",
        data: {
          cars: newData,
        },
      });
    }
  );
};

const putDataCars = (req, res) => {
  const id = req.params.id;
  const carIndex = cars.findIndex((el) => el.id === id);

  cars[carIndex] = { ...cars[carIndex], ...req.body };
  fs.writeFile(
    `${__dirname}/../data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `Car with ID = ${id} is edited`,
        data: {
          cars: cars[carIndex],
        },
      });
    }
  );
};

const deleteDataCars = (req, res) => {
  // Mencari ID dan mengonversi dari String ke Numbers
  const id = req.params.id;
  //   Mencari index ID
  //   If ID not found return -1
  const carIndex = cars.findIndex((el) => el.id === id);

  // Hapus data sesuai array
  cars.splice(carIndex, 1);
  //   Proses update di file JSON
  fs.writeFile(
    `${__dirname}/../data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `Car with ID = ${id} is deleted`,
        data: null,
      });
    }
  );
};

module.exports = {
  test,
  getAllCars,
  getCarById,
  createDataCars,
  putDataCars,
  deleteDataCars,
  checkId,
  checkBody,
};
