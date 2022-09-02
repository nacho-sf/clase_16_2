// (API) CONTROLADORES - LÓGICA DE NEGOCIO DE LA APP

const fetch = require('node-fetch');

// Facade: Tipo de patrón de diseño estructural

const getProducts = async (req, res) => {
    if (req.params.id) {
        try {
            let response = await fetch(`https://fakestoreapi.com/products/${req.params.id}`); // {object}
            let product = await response.json(); // {object}
            res.status(200).json(product); // Devuelve JSON
        }
        catch (error) {
            console.log(`ERROR: ${error.stack}`);
            res.status(404).json({ 'Error':'Producto no encontrado' }); // Devuelve JSON
        }
    } else {
        try {
            let response = await fetch(`https://fakestoreapi.com/products`); // [array]
            let products = await response.json(); // [array]
            res.status(200).json({ products }); // Devuelve JSON
        }
        catch (error) {
            console.log(`ERROR: ${error.stack}`);
            res.status(404).json({ 'Error':'Productos no encontrados' }); // Devuelve JSON
        }
    }
};

const createProduct = async (req, res) => {
    console.log("Esto es el console.log de lo que introducimos por postman", req.body); // Objeto recibido de producto nuevo
    const newProduct = req.body; // {} nuevo producto a guardar

    // Líneas para guardar en una BBDD o MongoDB
    try {
        let response = await fetch('https://fakestoreapi.com/products', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        })
        let answer = await response.json(); // objeto devuelto de la petición
        console.log("Este es el console.log de lo que devuelve la API", answer);
        res.status(201).json({"message":`Producto ${answer.title} guardado en el sistema con ID: ${answer.id}`});

    } catch (error) {
        console.log(`ERROR: ${error.stack}`);
        res.status(400).json({"message":`Error guardando producto ${answer.title}`});
    }

};

const deleteProduct = async (req, res) => {
    const msj = "Has enviado un DELETE para borrar product";
    console.log(msj);
    res.json({"message":msj});
};

module.exports = {
    getProducts,
    createProduct,
    deleteProduct
};