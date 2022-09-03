# clase_16_2
Clases (28/07 - 01/08): Integración SQL en NodeJS y CRUD (create, read, update, delete) -->(GET, POST, PUT, DETETE)


-Instalar PostgreSQL en windows y comprobar que funciona

-Nos conectaremos a PostgreSQL desde NodeJS

-Instalar Postgre en NodeJS -> nmp i pg

-Todas los métodos y operaciones sobre las bases de datos irán en la carpeta "models", así que creamos en esta "demo_pg.js" y pegamos e siguiente código:


const { Pool } = require('pg')
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  database: 'postgres',
  password: '1234'
})


pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack)
  }
  client.query('SELECT NOW()', (err, result) => {
    release()
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    console.log(result.rows)
  })
})

-Se ejecuta "demo_pg.js" en la terminal -> "node models/demo_pg.js", y si sale la fecha y hora local es que está conectado a nuestra base de datos

-Desde pgAdmin borrar las tablas authors y entries, y en la clase_17 (final de la pag) se usaran las queries para introducir en pgAdmin y crear las tablas, insertar los datos y hacer consultas (practicar en general).





-En vscode, crear en models "entry.js". Pegar el siguiente código:





const { Pool } = require('pg');
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    database: 'postgres',
    password: '1234'
  })


const queries = require("../queries/queries")  // Esto es para importar queries desde una carpeta de queries en mi proyecto, pero aun no está creada



// GET
const getEntriesByEmail = async (email) => {
    let client,result;
    try{
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query(queries.getEmailEntry,[email]) // 1 es el primer parametro
        result = data.rows
    }catch(err){
        console.log(err);
        throw err;
    }finally{
        client.release();    
    }
    return result
}




// GET
const getAllEntries = async () => {
    let client,result;
    try{
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query(`
        SELECT
        e.title,
        e.content,
        e.date,
        e.category,
        a.name,
        a.surname,
        a.image
    FROM entries AS e
    INNER JOIN authors AS a ON e.id_author = a.id_author`)
        result = data.rows
    }catch(err){
        console.log(err);
        throw err;
    }finally{
        client.release();    
    }
    return result
}



/*
// CREATE
const createEntry = async (entry) => {
    const {title,content,email,category} = entry;
    let client,result;
    try{
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query(`INSERT INTO entries(title,content,id_author,category) 
                                    VALUES ($1,$2,
                                    (SELECT id_author FROM authors WHERE email=$3),$4)`
                                    ,[title,content,email,category])
        result = data.rowCount
    }catch(err){
        console.log(err);
        throw err;
    }finally{
        client.release();    
    }
    return result
}
*/



// UPDATE
const updateEntry = async (entry) => {
    const {title,new_title,content,category} = entry;
    let client,result;
    try{
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query(`UPDATE entries SET
            title = $2,
            content = $3,
            category = $4    
        WHERE title = $1;`
        ,[title,new_title,content,category])
        result = data.rowCount
    }catch(err){
        console.log(err);
        throw err;
    }finally{
        client.release();    
    }
    return result
}




// DELETE 

const deleteEntry = async (entry) => {
    const {title} = entry;
    let client,result;
    try{
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query(`DELETE FROM entries
        WHERE entries.title = $1;`
        ,[title])
        result = data.rowCount
    }catch(err){
        console.log(err);
        throw err;
    }finally{
        client.release();    
    }
    return result
}





// GET All Authors:
const getAllAuthors = async () => {
    console.log("entra");
    let result;
    let client = await pool.connect(); // Espera a abrir conexion
    try{
        const data = await client.query(`SELECT * FROM authors`)
        result = data.rows
    }catch(err){
        console.log(err);
        throw err;
    }finally{
        client.release();    
    }
    return result
}





// GET Authors by email:
const getAuthorsByEmail = async (email) => {
    let client,result;
    try{
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query(`SELECT * FROM authors
        WHERE email = $1;`,[email]) // 1 es el primer parametro
        result = data.rows
    }catch(err){
        console.log(err);
        throw err;
    }finally{
        client.release();    
    }
    return result
}





// CREATE
const createAuthor = async (newAuthor) => {
    const {id_author,name,surname,email,image} = newAuthor;
    let client,result;
    try{
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query(`INSERT INTO authors(id_author,name,surname,email,image VALUES ($1,$2,$3,$4,$5)`
                                    ,[id_author,name,surname,email,image])
        result = data.rowCount
    }catch(err){
        console.log(err);
        throw err;
    }finally{
        client.release();    
    }
    return result
}






const entries = {
    getEntriesByEmail,
    getAllEntries,
    //createEntry,
    updateEntry,
    deleteEntry,
    getAllAuthors,
    getAuthorsByEmail,
    createAuthor
}

module.exports = entries;


// Pruebas
/*
    getEntriesByEmail("birja@thebridgeschool.es")
    .then(data=>console.log(data))



getAllEntries()
.then(data=>console.log(data))
*/

/*
let newEntry = {
    title:"Nos gustan las tortillas",
    content:"En el Marquina las tortillas vuelan",
    email:"albertu@thebridgeschool.es",
    category:"gastronomía"}

createEntry(newEntry)
.then(data=>console.log(data))
*/





-Esta construcción es parecida a lo que se ha hecho anteriormente. Son funciones asíncronas que luego se exportan. Cada función va a hacer lo que su propio nombre indica.

-En la primera función, la query está metida dentro del método ".query" de postgre:

await client.query(queries.getEmailEntry,[email])

por:

await client.query(`SELECT e.title,e.content,e.date,e.category,a.name,a.surname,a.image
FROM entries AS e
INNER JOIN authors AS a
ON e.id_author=a.id_author
WHERE a.email=$1
ORDER BY e.title;`,[email])





-Se usa async await porque tiene que esperar a que responda el servidor
-"client" es el objeto de conexión -> se conecta a la base de datos
-En el método client.query está lanzando manualmente la ejecución de la query (darle al play en pgAdmin)

-La query se parametriza para evitar ataques Inyection. En la query:

WHERE a.email='alejandru@thebridgeschool.es'

por:

WHERE a.email=$1

-Y después se coloca como segundo parámetro del método client.query(`query`, [2ºparam])--> un array que contiene los valores (var) referenciados según el orden que ocupen en el array.

-"finaly" se usa para cerrar la conexión a la base de datos, una vez concluída la petición

-Esta estructura de los ejemplos es casi un patrón, así que se podrían copiar y adaptarlo solo escribiendo nuestra query.

-Estas funciónes (peticiones) se asociaran a diferentes rutas:
    -getEntries.. (Leer en DB)--> GET
    -createEntry (escribir en DB)--> POST (con un body enganchado desde otro módulo)

    -> En la función createEntry hay otro ejemplo de parametrización de la query para evitar el ataque Injection




-Hacer prueba -> descomentar la primera prueba:

-> Ejecutar node models/entry.js

-Te devuelve un array de objetos procesado, con los valores de la query hecha a la base de datos, cosa que ya es manejable (el array de objetos) para operar como sea necesario.


-Hacer prueba de crear registro --> Descomentar "newEntry" y ejecutar. Te devuelve en la terminal en número de entradas creadas. Si vamos a Postgre y hacemos un query para ver los registros de entries, veremos los nuevos datos





INICIO CLASE 01/08:


REPASO:

-El objetivo de back es crear una API que nos permita leer, crear, borrar y actualizar datos.

-Para acceder a una API tengo que tener creados los endpoints (diseñar rutas) en la carpeta "routes"

    ->Nos vamos a la carpeta "routes" y creamos "entriesApiRoutes.js"

-También hay que crear los controladores para los métodos de "models" (BBDD)

    ->Nos vamos a la carpeta "controllers" y creamos "entriesApiController.js"


-Vamos a la archivo "entriesApiRoutes.js" y creamos las rutas en función de los métodos que queremos llegar en models/"entry.js"

-Primero diseñamos los endpoints (comentados) para visualizarlos

-Pueden existir rutas que sean iguales, teniendo distinto método. Ej:
-->router.get("/entries")
-->router.post("/entries")

---> Entonces, en nuestro ejemplo, habilitaremos 3 endpoints. Sin embargo, en el router añadiremos 2 líneas (una de ellas tiene 2 métodos distintos, GET y POST)


-Después, copiamos las 3 primeras líneas de "productsApiRoutes.js" (importación de controladores) y las adaptamos a nuestro ejercicio (products --> entries)
    ----> Ojo! El controlador no está creado todavía...

-Luego, escribimos el objeto de ruta importado "entriesApiRouter", más los métodos que queramos asociarle (.get //  .post)

    Ej--> entriesApiRouter.get('/entries', función_asociada)
          entriesApiRouter.post('/entries', función_asociada)

-Por último, se exportaría el obeto router --> "module.exports = entriesApiRouter"


-Ahora, tendríamos que crear las funciones asociadas a las rutas en el archivo "entriesApiController.js" (crear los controladores)

-Los nombres de estas funciones asociadas los idearemos en función de lo que hagan. Ej: getEntries - createEntry

-Si nos fijamos, tenemos una ruta para dos métodos distintos:
    --> "entriesApiRouter.get('/entries') -->  getEntries // getAllEntry

Entonces, en lugar de escribir dos rutas iguales (con llamada a funciones asociadas distintas), en una única función asociada escribimos un condicional que haga una cosa u otra. (vídeo min 27:30)



-Se crean en "entriesApiController.js" las funciones asóncronas getEntries y createEntries (inicialmente solo título). Luego se exporta (module.export = {getEntries, createEntry}).

-Estas funciones van a ser invocadas por las rutas. Se ejecuta como un método de la ruta --> entriesApiRouter.get('/entries', entriesApiController.getEntries) (función asociada)

-El código de estas funciones asociadas (lógica de negocio), tendrá que ejecutar una llamada a los métodos de bases de datos (models), que a su vez, los métodos de models van a meter y sacar cosas de la base de datos



ARCHIVO RUTAS --> ARCHIVO CONTROLADORES --> ARCHIVO MODELO



ARCHIVO RUTAS

 --> (la ruta le dice al controlador qué acción tiene que hacer / GET, POST...)

 ARCHIVO CONTROLADORES

 --> (el controlador le va a solicitar al modelo lo que quiere / getAll, postOne...)

ARCHIVO MODELO



-Entonces, se importa el modelo --> "const entry = require('../models/entry')"

-Ahora, se escribe el código de la función getEntries:


    -> Para esta función tendremos dos rutas:
    // GET http://localhost:3000/entries -> ALL
    // GET http://localhost:3000/entries?email=hola@gmail.com -> Por email

(query. -> Para acceder a los parámetros de URL. ej: query.email)

const getEntries = async (req, res) => {
    //Se declara la variable que tiene que devolver la función
    let entries;
    try {
        //Si me pasas un email
        if (req.query.email) {
            //Búsqueda por email, invocando el método asíncrono getEntriesByEmail
            entries = await entry.getEntriesByEmail(req.query.email);
            //Devuelve [] con las entries encontradas
            res.status(200).json(entries); 
        }else {
            //Si no pasas email, invocar método asíncrono getAllEntries
            entries = await entry.getAllEntries();
            res.status(200).json(entries);
        };
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
};



-FUNCIONAMIENTO: En la ruta se pone la función de controlador asociada (función callback). A su vez, el controlador es una función asíncrona, el cual, en función del parámetro que le pases ordena una llamada a los métodos del modelo, los cuales obtendran los datos de la función getEntriesByEmail (entradas filtradas por email) o getAllEntries (todas las entradas)



-Una vez escritos los controladores, habrá que declarar las rutas en "app.js"

    -> //Rutas
    -> const entriesApiRoutes = require("./routes/entriesApiRoutes");

    -> //Router de entries: API
    -> app.use("/api/entries", entriesApiRoutes);

    -> En "entriesApiRoutes.js" modificar ruta:
        ->entriesApiRouter.get('/entries', función_asociada)
        por:
        ->entriesApiRouter.get('/', función_asociada)

        Porque ya tenemos entries en la ruta en "app.js"


-Guardar todo, encender postgre, ejecutar "app.js"

-Probar la ruta "http://localhost:3000/api/entries" en Postman para ver si funciona




CREATE ENTRY:

-En Postman habrá que mandar un POST a la ruta "/entries", rellenando el textarea del body con un objeto de entrada. Pero antes, crearemos el controlador del POST:

El objeto que irá en el body de Postman será:

let newEntry = {
    title:"Nos gustan las tortillas",
    content:"En el Marquina las tortillas vuelan",
    email:"albertu@thebridgeschool.es",
    category:"gastronomía"
}


-Entonces, cuando me mendan un POST (objeto) al servidor, se recoje con "req.body"

-Se escribe la función::

const createEntry = async (req,res) => {
    console.log(req.body);
    //Se guarda en la variable el objeto newEntry leído en el body de Postman
    const newEntry = req.body; // {tilte, content, email, category}
    //Respuesta
    const response = await entry.createEntry(newEntry);
    res.status(200).json({"saved":response});
};

-Se prueba en Postman, adaptando el objeto newEntry (poner comillas a las claves):

{
    "title":"Nos gustan las tortillas",
    "content":"En el Marquina las tortillas vuelan",
    "email":"albertu@thebridgeschool.es",
    "category":"gastronomía"
}

-Si la respuesta es "saved 1", es que ha funcionado bien.


-La función tendrá que devolver lo que se pida, entonces, la respuesta se puede personalizar modificando la última línea de respuesta de la función:

const createEntry = async (req,res) => {
    console.log(req.body);
    //Se guarda en la variable el objeto newEntry leído en el body de Postman
    const newEntry = req.body; // {tilte, content, email, category}
    //Respuesta
    const response = await entry.createEntry(newEntry);
    res.status(201).json({"items_created":response, data:newEntry});
};







/////////////////  RESUMEN/REPASO  ///////////////

--> Funcionamiento interno de Express con un modelo, un controlador y hablando entre sí





    [app.js]

-Las rutas que creo estan detalladas en "app.js":

// Router de entries: API
app.use("/api/entries", entriesApiRoutes);

-->Las rutas con el prefijo "/api/entries" van a estar manejadas por el controlador de rutas "entriesApiRoutes"







    [entriesApiRoutes.js]


-Se están habilitando 2 rutas, una para GET y otra para POST, que al final se traducirá en 3 endpoints:

    -2 endpoints de GET: Busca todas la entries // Busca entries por email
    -1 endpoints de POST: Crea nuevas entradas


// 3 Endpoints de las 2 rutas (getEntries y CreateEntry):
// GET http://localhost:3000/entries -> ALL
// GET http://localhost:3000/entries?email=hola@gmail.com -> Por email
// POST http://localhost:3000/entries

// entriesApiRouter.get("/", entriesApiController.getEntries);
// entriesApiRouter.post("/", entriesApiController.createEntry);


--> Estas rutas, cuando sean llamadas, van a ejecutar sus funciones de callback, que están como segúndo parámetro del metodo ".get" o ".post", y que están llamando al controlador de entries "entriesApiController.getEntries o .createEntry"







    [entriesApiController.js]



-Controlador "getEntries" --> IF...ELSE:

    -->En función de lo que me pidas en la request, te llevo a un sitio u a otro. En el ejemplo:

        -Si me pasa un email, me buscas todas las entradas por email.
        -Si no me pasas parámetro, busca todas las entradas.
        -->  Esto hace una llamada al método del modelo (BBDD).

    -->Cuando acaba lo antrior, hace un response.json(entries), que es devolverte el array con las entradas que haya encontrado.


-De forma general, cada vez que se usa algo de una Api de Express:

    1º-> Leo la petición "req" ---> "getEntries = async (req, res) => {}"
      -> De la petición "req" leo:
          - En GET (req.quey.email) ----> Los parámetros que me lleguen
          - En POST (req.body) ---------> Lo que me llegue por el body

    2º-> Se llama al método adecuado en función de lo que se quiera hacer, y se guarda:
          - Ej: const response = await entry.createEntry(newEntry)
    
    3º-> Se devuelve respuesta para ver lo que se ha sacado:
          - res.status(201).json({"item_created": response, data: newEntry})






    [entry.js]

-Los métodos de modelo se comunican directamente con la base de datos.

-Es donde se ubican las queries que se hacen a la base de datos. Cuando haya muchas queries, es recomendable sacarlas a una carpeta aparte. Por ejemplo:

    -> Se podría hacer un fichero *.json de queries, hacer un export en "*.json", e importarlo en "entry.js"