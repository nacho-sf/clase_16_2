const { Pool } = require('pg');
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    database: 'postgres',
    password: '1234'
  })




///////////  MÉTODOS:



// GET
const getEntriesByEmail = async (email) => {
    let client,result;
    try{
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query(`SELECT e.title,e.content,e.date,e.category,a.name,a.surname,a.image
        FROM entries AS e
        INNER JOIN authors AS a
        ON e.id_author=a.id_author
        WHERE a.email=$1
        ORDER BY e.title;`,[email]) // 1 es el primer parametro
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




/////////// EXPORTACIÓN DE MÉTODOS:


const entries = {
    getEntriesByEmail,
    getAllEntries,
    createEntry,
    //deleteEntry,
    //updateEntry,
    //getAllAuthors,
    //getAuthorsByEmail,
    //createAuthor
}
module.exports = entries;



// Pruebas
/*
    getEntriesByEmail("birja@thebridgeschool.es")
    .then(data=>console.log(data))
*/


/* getAllEntries()
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