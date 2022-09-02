const express = require('express');

// (API) RUTAS DE PRODUCTOS
const productsApiController = require("../controllers/productsApiController")
const productsApiRouter = express.Router();

const checkApiKey = require('../middlewares/auth_API_KEY');


// Products API

// GET: http://localhost:3000/api/products
productsApiRouter.get('/:id?', productsApiController.getProducts);
  
// POST: http://localhost:3000/api/products
productsApiRouter.post('/', checkApiKey, productsApiController.createProduct);

// DELETE: http://localhost:3000/api/products
productsApiRouter.delete("/", checkApiKey, productsApiController.deleteProduct);

module.exports = productsApiRouter;