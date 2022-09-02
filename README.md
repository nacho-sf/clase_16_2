# clase_16_2
Intro a BBDD SQL (2)

-Instalar PostgreSQL en windows y comprobar que funciona

-Nos conectaremos a PostgreSQL desde NodeJS

-Instalar Postgre en NodeJS -> nmp i pg

-Todas las operaciones sobre las bases de datos irán en la carpeta "models", así que creamos en esta "demo_pg.js" y pegamos e siguiente código:


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


-Hacer prueba de crear registro --> Descomentar "newEntry"