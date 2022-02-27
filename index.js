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


// Start Application
function init() {
   
    console.log("---------------------   WELCOME TO EMPLOYEE TRACKER   ------------------------");
    console.log(" ");
 
    initMenu();
};

// Main menu
function initMenu() {
    inquirer
        .prompt({
            name: "initMenu",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Employees By Department",
                "View All Employees By Manager",
                "Add Employee",
                "Remove Employee",
                "Update Employee Title",
                "Update Employee Manager",
                new inquirer.Separator(),
                "View All Departments",
                "Add Department",
                "Remove Department",
                new inquirer.Separator(),
                "View All Roles",
                "Add Role",
                "Remove Role",
                new inquirer.Separator(),
                "Total Utilized Budget By Department",
                new inquirer.Separator(),
                "Exit",
                new inquirer.Separator()
            ]
        }).then(response => {
            switch (response.initMenu) {

                case "View All Employees":
                    return queryEmployees("", "");

                case "View All Employees By Department":
                    return employeeByDepartment();

                case "View All Employees By Manager":
                    return employeeByManager();

                case "Add Employee":
                    return addEmployee();

                case "Remove Employee":
                    return removeEmployee();

                case "Update Employee Title":
                    return updateEmployee("title");

                case "Update Employee Manager":
                    return updateEmployee("manager");

                case "View All Departments":
                    return viewDepartments();

                case "Add Department":
                    return addDepartment();

                case "Remove Department":
                    return removeDepartment();

                case "View All Roles":
                    return viewRoles();

                case "Add Role":
                    return addRole();

                case "Remove Role":
                    return removeRole();

                case "Total Utilized Budget By Department":
                    return totalBudgetDepartment();

                case "Exit":
                    return connection.end();
            }
        });

}