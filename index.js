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

// Query Employees
function queryEmployees(type, filter) {

    let query = "SELECT e.id, e.first_name, e.last_name, title, name, salary, CONCAT_WS(' ', e2.first_name, e2.last_name) manager FROM employee e ";
    query += "LEFT JOIN role ";
    query += "ON role_id = role.id ";
    query += "LEFT JOIN department ";
    query += "ON role.department_id = department.id ";
    query += "LEFT JOIN employee e2 ON e.manager_id = e2.id ";
    if (type === "manager") {
        query += "WHERE CONCAT_WS(' ', e2.first_name, e2.last_name) = ? ";
    }
    else if (type === "department") {
        query += "WHERE name = ? ";
    }
    query += "ORDER BY e.id ASC";
    connection.query(query, [filter], (err, res) => {
        if (err) throw err;
        let employeeArray = [];
        res.forEach(employee => {
            const newEmployee = new Employee(employee.id, employee.first_name, employee.last_name, employee.title, employee.name, employee.salary, employee.manager);
            employeeArray.push(newEmployee);
        });
        console.table(employeeArray);
        initMenu();
    });

}

// Get Employee by Manager
function employeeByManager() {

    let query = "SELECT DISTINCT CONCAT_WS(' ', e2.first_name, e2.last_name) manager FROM employee e ";
    query += "INNER JOIN employee e2 ON e.manager_id = e2.id ";
    query += "ORDER BY e.id ASC";
    connection.query(query, (err, res) => {
        if (err) throw err;
        // Get managers asynchronously 
        getManagers(res).then(result => {
            inquirer
                .prompt({
                    name: "selManager",
                    type: "list",
                    message: "Selected a manager to filter by:",
                    choices: result
                }).then(response => {
                    queryEmployees("manager", response.selManager);
                });
        });
    });

}

// Get Employee by Department
function employeeByDepartment() {

    let query = "SELECT name FROM department ";
    query += "ORDER BY id ASC";
    connection.query(query, (err, res) => {
        if (err) throw err;
        // Get departments asynchronously 
        getDepartments(res).then(result => {
            inquirer
                .prompt({
                    name: "selDepartment",
                    type: "list",
                    message: "Selected a department to filter by:",
                    choices: result
                }).then(response => {
                    queryEmployees("department", response.selDepartment);
                });
        });
    });

}

// Add Employee
function addEmployee() {

    let query = "SELECT title FROM role ";
    query += "ORDER BY id ASC";
    connection.query(query, (err, res) => {
        if (err) throw err;
        // Get roles asynchronously 
        getRoles(res).then(result => {
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "Enter employee first name:",
                        name: "firstName"
                    },
                    {
                        type: "input",
                        message: "Enter employee last name:",
                        name: "lastName"
                    },
                    {
                        type: "list",
                        message: "Select employee title:",
                        name: "selRole",
                        choices: result
                    }
                ]).then(response => {
                    if (response.firstName === "" || response.lastName === "") {
                        console.log("No employee added. Field(s) were blank.")
                        return initMenu();
                    }
                    let query = "SELECT id, CONCAT_WS(' ', first_name, last_name) name FROM employee ";
                    query += "ORDER BY id ASC";
                    connection.query(query, (err, res) => {
                        if (err) throw err;
                        getEmployees(res).then(result2 => {
                            result2.push(new inquirer.Separator(), "Null", new inquirer.Separator());
                            inquirer
                                .prompt([
                                    {
                                        type: "list",
                                        message: "Select employee manager:",
                                        name: "selManager",
                                        choices: result2
                                    }
                                ]).then(response2 => {

                                    let newEmployee = {};
                                    if (response2.selManager === "Null") {
                                        newEmployee = {
                                            first_name: response.firstName,
                                            last_name: response.lastName,
                                            role_id: res[result.indexOf(response.selRole)].id
                                        }
                                    } else {
                                        newEmployee = {
                                            first_name: response.firstName,
                                            last_name: response.lastName,
                                            role_id: res[result.indexOf(response.selRole)].id,
                                            manager_id: res[result2.indexOf(response2.selManager)].id
                                        }
                                    }

                                    connection.query("INSERT INTO employee SET ?",
                                        newEmployee,
                                        (err, res) => {
                                            if (err) throw err;
                                            console.log(`${newEmployee.first_name} ${newEmployee.last_name} has been added.`);
                                            addAnother("addEmployee");
                                        });
                                });
                        });
                    });
                });
        });
    });

}
// Remove Employee
function removeEmployee() {

    let query = "SELECT id, CONCAT_WS(' ', first_name, last_name) name FROM employee ";
    query += "ORDER BY id ASC";
    connection.query(query, (err, res) => {
        if (err) throw err;
        getEmployees(res).then(result => {
            result.push(new inquirer.Separator(), "Cancel", new inquirer.Separator());
            inquirer
                .prompt([
                    {
                        type: "list",
                        message: "Select employee to remove:",
                        name: "selEmployee",
                        choices: result
                    }
                ]).then(response => {
                    if (response.selEmployee === "Cancel") {
                        initMenu();
                    } else {
                        inquirer
                            .prompt([
                                {
                                    type: "list",
                                    message: `Are you sure you want to remove ${response.selEmployee}?`,
                                    name: "areYouSure",
                                    choices: ["yes", "no"]
                                }
                            ]).then(response2 => {
                                if (response2.areYouSure === "yes") {
                                    let employeeId = res[result.indexOf(response.selEmployee)].id;
                                    //console.log(employeeId);
                                    connection.query("DELETE FROM employee WHERE ?",
                                        {
                                            id: employeeId
                                        },
                                        (err, res) => {
                                            if (err) throw err;
                                            console.log(`${response.selEmployee} employee has been removed.`);
                                            initMenu();
                                        }
                                    );
                                } else {
                                    initMenu();
                                }
                            });
                    }
                });
        });
    });

}
// Update Employee
function updateEmployee(type) {

    let query = "SELECT id, CONCAT_WS(' ', first_name, last_name) name FROM employee ";
    query += "ORDER BY id ASC";
    connection.query(query, (err, res) => {
        if (err) throw err;
        getEmployees(res).then(result => {
            result.push(new inquirer.Separator(), "Cancel", new inquirer.Separator());
            inquirer
                .prompt([
                    {
                        type: "list",
                        message: "Select employee to update title of:",
                        name: "selEmployee",
                        choices: result
                    }
                ]).then(response => {
                    if (response.selEmployee === "Cancel") {
                        initMenu();
                    } else {

                        // Update Title
                        if (type === "title") {
                            let query = "SELECT id, title FROM role ";
                            query += "ORDER BY id ASC";
                            connection.query(query, (err, res2) => {
                                if (err) throw err;
                                // Get roles asynchronously 
                                getRoles(res2).then(result2 => {
                                    inquirer
                                        .prompt([
                                            {
                                                type: "list",
                                                message: "Select employee title:",
                                                name: "selRole",
                                                choices: result2
                                            }
                                        ]).then(response2 => {

                                            connection.query(
                                                "UPDATE employee SET ? WHERE ?",
                                                [
                                                    {
                                                        // set to
                                                        role_id: res2[result2.indexOf(response2.selRole)].id
                                                    },
                                                    {
                                                        // select
                                                        id: res[result.indexOf(response.selEmployee)].id
                                                    }
                                                ],
                                                function (err, res) {
                                                    if (err) throw err;
                                                    console.log(`${response.selEmployee}'s title has been updated.`);
                                                    initMenu();
                                                }
                                            );
                                        });

                                });
                            });
                        }

                        // Update Manager
                        if (type === "manager") {
                            let query = "SELECT id, CONCAT_WS(' ', first_name, last_name) name FROM employee ";
                            query += "ORDER BY id ASC";
                            connection.query(query, (err, res2) => {
                                if (err) throw err;
                                getEmployees(res2).then(result2 => {
                                    result2.push(new inquirer.Separator(), "Null", new inquirer.Separator());
                                    inquirer
                                        .prompt([
                                            {
                                                type: "list",
                                                message: "Select employee manager:",
                                                name: "selManager",
                                                choices: result2
                                            }
                                        ]).then(response2 => {
                                            let updateQuery = "";
                                            let updateInputs = [];
                                            if (response2.selManager === "Null") {
                                                updateQuery = "UPDATE employee SET manager_id = NULL WHERE ?";
                                                updateInputs = [
                                                    {
                                                        id: res[result.indexOf(response.selEmployee)].id
                                                    }
                                                ];
                                            } else {
                                                updateQuery = "UPDATE employee SET ? WHERE ?";
                                                updateInputs = [
                                                    {
                                                        manager_id: res2[result2.indexOf(response2.selManager)].id
                                                    },
                                                    {
                                                        id: res[result.indexOf(response.selEmployee)].id
                                                    }
                                                ]
                                            }

                                            connection.query(
                                                updateQuery,
                                                updateInputs,
                                                function (err, res) {
                                                    if (err) throw err;
                                                    console.log(`${response.selEmployee}'s manager has been updated.`);
                                                    initMenu();
                                                }
                                            );
                                        });
                                });
                            });
                        }
                    }
                });
        });
    });

}
// View All Departments
function viewDepartments() {
    let query = "SELECT id, name FROM department ";
    query += "ORDER BY id ASC";
    connection.query(query, (err, res) => {
        if (err) throw err;
        departmentArray = [];
        res.forEach(department => {
            departmentArray.push({ id: department.id, department: department.name })
        })
        console.table(departmentArray);
        initMenu();
    });
}

// Add Department
function addDepartment() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter name for new department:",
                name: "depName"
            }
        ]).then(response => {
            if (response.depName == "") {
                console.log("No department added. Name was blank.")
                return initMenu();
            }
            connection.query("INSERT INTO department SET ?",
                [{ name: response.depName }],
                (err, res) => {
                    if (err) throw err;
                    console.log(`${response.depName} department has been added.`);
                    addAnother("addDepartment");
                });
        });
}

// Remove Department
function removeDepartment() {
    let query = "SELECT id, name FROM department ";
    query += "ORDER BY id ASC";
    connection.query(query, (err, res) => {
        if (err) throw err;
        getDepartments(res).then(result => {
            inquirer
                .prompt({
                    name: "selDepartment",
                    type: "list",
                    message: "Selected a department to remove:",
                    choices: result
                }).then(response => {
                    inquirer
                        .prompt([
                            {
                                type: "list",
                                message: `Are you sure you want to remove ${response.selDepartment}?`,
                                name: "areYouSure",
                                choices: ["yes", "no"]
                            }
                        ]).then(response2 => {
                            if (response2.areYouSure === "yes") {
                                let departmentId = res[result.indexOf(response.selDepartment)].id;
                                connection.query("DELETE FROM department WHERE ?",
                                    {
                                        id: departmentId
                                    },
                                    (err, res) => {
                                        if (err) throw err;
                                        console.log(`${response.selDepartment} department has been removed.`);
                                        initMenu();
                                    }
                                );
                            } else {
                                initMenu();
                            }
                        })
                });
        });
    });
}

// View All Roles
function viewRoles() {
    let query = "SELECT r.id, r.title, r.salary, d.name FROM role r ";
    query += "LEFT JOIN department d ON r.department_id = d.id ";
    query += "ORDER BY r.id ASC";
    connection.query(query, (err, res) => {
        if (err) throw err;
        roleArray = [];
        res.forEach(role => {
            roleArray.push({ id: role.id, title: role.title, salary: role.salary, department: role.name })
        });
        console.table(roleArray);
        initMenu();
    });
}

// Add Role
function addRole() {
    let query = "SELECT id, name FROM department ";
    query += "ORDER BY id ASC";
    connection.query(query, (err, res) => {
        if (err) throw err;
        getDepartments(res).then(result => {
            inquirer
                .prompt({
                    name: "selDepartment",
                    type: "list",
                    message: "Selected a department to add a new role too:",
                    choices: result
                }).then(response => {
                    let departmentId = res[result.indexOf(response.selDepartment)].id;
                    inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "Enter title for new role:",
                                name: "roleTitle"
                            },
                            {
                                type: "input",
                                message: "Enter salary for new role:",
                                name: "roleSalary"
                            }
                        ]).then(response => {
                            if (response.roleTitle == "" || response.roleSalary == "") {
                                console.log("No role added. Field(s) were blank.")
                                return initMenu();
                            }
                            connection.query("INSERT INTO role SET ?",
                                [{ title: response.roleTitle, salary: response.roleSalary, department_id: departmentId }],
                                (err, res) => {
                                    if (err) throw err;
                                    console.log(`${response.roleTitle} role has been added.`);
                                    addAnother("addRole");
                                });

                        });
                });
        });
    });
}

// Remove Role
function removeRole() {
    let query = "SELECT id, title FROM role ";
    query += "ORDER BY id ASC";
    connection.query(query, (err, res) => {
        if (err) throw err;
        getRoles(res).then(result => {
            inquirer
                .prompt({
                    name: "selRole",
                    type: "list",
                    message: "Selected a role to remove:",
                    choices: result
                }).then(response => {
                    inquirer
                        .prompt([
                            {
                                type: "list",
                                message: `Are you sure you want to remove ${response.selRole}?`,
                                name: "areYouSure",
                                choices: ["yes", "no"]
                            }
                        ]).then(response2 => {
                            if (response2.areYouSure === "yes") {
                                let roleId = res[result.indexOf(response.selRole)].id;
                                connection.query("DELETE FROM role WHERE ?",
                                    {
                                        id: roleId
                                    },
                                    (err, res) => {
                                        if (err) throw err;
                                        console.log(`${response.selRole} role has been removed.`);
                                        initMenu();
                                    }
                                );
                            } else {
                                initMenu();
                            }
                        })
                });
        });
    });

}