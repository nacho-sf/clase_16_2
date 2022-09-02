// Módulos externos
const express = require("express");
const emoji = require("emoji-whale");
const cowsay = require("cowsay2");
const owl = require("cowsay2/cows/owl");
const whale = require("cowsay2/cows/whale");

// Rutas de productos
const productsRoutes = require("./routes/productsRoutes");
const productsApiRoutes = require("./routes/productsApiRoutes");

// Módulos propios
const calc = require("./utils/calculator");
console.log(calc.add(10, 100));

// Tus Middleware
const manage404 = require('./middlewares/error404');
const checkApiKey = require('./middlewares/auth_API_KEY');


// Variables globales
const app = express()
const port = 3000

// View engine
app.set('view engine', 'pug');
app.set('views','./views'); 

// Read body in POST
app.use(express.json());

// Middleware APIKEY. Colocado en Router de productos
// Este afecta a todas las rutas del documento:
// app.use(checkApiKey);

// Router de productos: WEB
app.use("/products", productsRoutes);
//Con middleware de acceso para TODAS las rutas /products:
//app.use("/products", checkApiKey, productsRoutes);

// Router de productos: API
app.use("/api/products", productsApiRoutes);



///////////// RUTAS WEB: --> Devuelven vistas

// http://localhost:3000/products GET
// http://localhost:3000/products/3 GET


///////////// RUTAS API: --> Devuelven objetos

// http://localhost:3000/api/products GET
// http://localhost:3000/api/products/3 GET
// http://localhost:3000/api/products POST
// http://localhost:3000/api/products DELETE




// GET: HOME
// http://localhost:3000
// http://127.0.0.1:3000
app.get('/', (req, res) => {
  console.log(emoji);
  console.log(cowsay.say("Hola!", { cow: owl }));
  //res.send('Hola desde mi primer servidor! '+emoji)
  let msj = 'Hola desde mi primer servidor! '+emoji;
  res.render("my_view",{section:"Home", msj}); // Renderizado en html ("template",{objeto});
});

// GET: http://localhost:3000/pokemon/Pikachu
app.get('/pokemon/:name?', (req, res) => {
    console.log(req.params);
    let msj = "";
    if (req.params.name) {
        msj = "Aquí te envio a: " + req.params.name;
    } else {
        msj = "Aquí te envío a todos los pokemon";
    }

  console.log(cowsay.say(msj, { cow: owl }));
  //res.send(msj+" "+emoji);
  res.render("my_view",{section:"Pokemon", msj});
});

// GET: http://localhost:3000/perritos
app.get('/perritos', (req, res) => {
  let msj = "¿Cuánto son 2+2?: "+calc.add(2,2);
  console.log(cowsay.say(msj, { cow: owl }));
  //res.send('Aquí te enviaría mis perritos y ... '+msj+" "+emoji);
  let msj2 = 'Aquí te enviaría mis perritos y ... '+msj+" "+emoji;
  res.render("my_view",{section:"Perritos", msj:msj2});
});


// Middleware de error 404
// Respuesta por defecto para rutas no existentes
app.use(manage404);


// Listener lanazado al iniciar servidor
app.listen(port, () => {
  console.log(cowsay.say(`Mi servidor funciona en http://localhost:${port}`, { cow: whale }));
});