const express = require("express");
// Rutas de entries:
const entriesApiController = require("../controllers/entriesApiController");
const entriesApiRouter = express.Router();

entriesApiRouter.get("/", entriesApiController.getEntries);
entriesApiRouter.post("/", entriesApiController.createEntry);
//entriesApiRouter.put("/", entriesApiController.updateEntry);
//entriesApiRouter.delete("/", entriesApiController.deleteEntry);
//entriesApiRouter.get("/", entriesApiController.getAuthors);
//entriesApiRouter.post("/", entriesApiController.createAuthor);


module.exports = entriesApiRouter;


// 3 Endpoints de las 2 rutas (getEntries y CreateEntry):

// GET http://localhost:3000/entries -> ALL
// GET http://localhost:3000/entries?email=hola@gmail.com -> Por email
// POST http://localhost:3000/entries