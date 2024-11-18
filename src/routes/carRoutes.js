// routes/carsRoutes.js
const express = require('express');
const CarsController = require('../controllers/carController');

const router = express.Router();

router.post('/api/v1/cars', CarsController.createCar);
router.get('/api/v1/cars', CarsController.getAllCars);
router.get('/api/v1/cars/:id', CarsController.getCarById);
router.patch('/api/v1/cars/:id', CarsController.updateCar);
router.delete('/api/v1/cars/:id', CarsController.deleteCar);

router.get('/api/v1/cars/:id/items', CarsController.getCarItems); // Para obter itens de um carro específico
router.get('/api/v1/cars/items', CarsController.getAllCarItems); // Para obter todos os itens de todos os carros

module.exports = router;