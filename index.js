// DEPENDENCIES
var mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const fs = require('fs');
require("dotenv").config();

// CLASSES
const Employee = require("./lib/Employee");

// Import connection.js module for SQL server connection
const connection = require("./config/connection");

// Connect to database
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    init();
});


// Get Managers
async function getManagers(array) {
    let managers = [];
    for (let i = 0; i < array.length; i++) {
        await managers.push(array[i].manager);
    }
    return managers;
}
