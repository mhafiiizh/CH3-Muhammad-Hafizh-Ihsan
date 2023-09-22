const express = require("express");

const router = express.Router();
const carsControllers = require("../controllers/carsControllers");

router.param("id", carsControllers.checkId);

router.route("/").get(carsControllers.test);
router
  .route("/cars")
  .get(carsControllers.getAllCars)
  .post(carsControllers.checkBody, carsControllers.createDataCars);
router
  .route("/cars/:id")
  .get(carsControllers.getCarById)
  .put(carsControllers.putDataCars)
  .delete(carsControllers.deleteDataCars);

module.exports = router;
