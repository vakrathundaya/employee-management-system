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
//Get Departments
async function getDepartments(array) {
    let departments = [];
    for (let i = 0; i < array.length; i++) {
        await departments.push(array[i].name);
    }
    return departments;
}

// Get Role
async function getRoles(array) {
    let roles = [];
    for (let i = 0; i < array.length; i++) {
        await roles.push(array[i].title);
    }
    return roles;
}
//Get Employees
async function getEmployees(array) {
    let employeesArray = [];
    for (let i = 0; i < array.length; i++) {
        await employeesArray.push(`${array[i].name}`);
    }
    return employeesArray;
}

// Add Another?
function addAnother(returnTo) {
    inquirer
        .prompt({
            name: "addAnother",
            type: "list",
            message: "Add another?",
            choices: ["no", "yes"]
        }).then(response => {
            if (response.addAnother === "yes") {
                if (returnTo === "addEmployee") {
                    addEmployee();
                } else if (returnTo === "addDepartment") {
                    addDepartment();
                } else if (returnTo === "addRole") {
                    addRole();
                }
            } else {
                initMenu();
            }
        });
}