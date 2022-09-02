// RUTAS DE PRODUCTOS

const express = require('express');

const productsController = require("../controllers/productsController")
const productsRouter = express.Router();

// Este Middleware solo era para el POST y DELETE
//const checkApiKey = require('../middlewares/auth_API_KEY');

// GET: http://localhost:3000/products
productsRouter.get('/:id?', productsController.getProducts);

// POST: http://localhost:3000/products --> INECESARIA
//productsRouter.post('/', checkApiKey, productsController.createProduct);

// DELETE: http://localhost:3000/products --> INECESARIA
//productsRouter.delete("/", checkApiKey, productsController.deleteProduct);

module.exports = productsRouter;