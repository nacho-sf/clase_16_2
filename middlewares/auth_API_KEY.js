// http://localhost:3000/products?API_KEY=laquesea

const checkApiKey = function(req, res, next) {

    // Código para comprobar si existe API KEY en BBDD

    if (req.query.API_KEY) {
        next();
    } else {
        res.status(401).send("Error. API KEY no proveída");
    }
};

module.exports = checkApiKey;