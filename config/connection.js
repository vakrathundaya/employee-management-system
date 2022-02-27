// Install mySQL dependency
const mysql = require("mysql");

// Reads .env file
require("dotenv").config();

// Destructure values from db.env file for SQL server connection
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Establish SQL server
const connection = mysql.createConnection({
    
    // Host name
    host: DB_HOST,
  
    // Port
    port: DB_PORT,
  
    // Username
    user: DB_USER,
  
    // SQL password
    password: DB_PASSWORD,

    // Database name
    database: DB_NAME,
});

// Exports connection credentials for use in server.js
module.exports = connection;