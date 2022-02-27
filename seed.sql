USE employee_db;

-- Creates sample records for departments table
INSERT INTO department (name) VALUES ("Engineering");
INSERT INTO department (name) VALUES ("Finance");
INSERT INTO department (name) VALUES ("Legal");
INSERT INTO department (name) VALUES ("sales");


-- Creates sample records for roles table
INSERT INTO role (title, salary, department_id) VALUES ("Sales Lead", 100000, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Sales Person", 80000, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Lead Engineer", 60000, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Software Engineer", 70000, 3);
INSERT INTO role (title, salary, department_id) VALUES ("Account Manager", 50000, 3);
INSERT INTO role (title, salary, department_id) VALUES ("Accountant", 65000, 4);





-- Creates sample records for employees table
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ("John", "Doe", null, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ("Mike", "Chan", 1, 4);
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ("Ashley", "Rodriguez", 1, 2);
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ("Kevin", "Tupik", 1, 6);
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ("Kunal", "Singh", 3, 3);
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ("Malia", "Brown", 3, 3);
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ("Sara", "Lourd", 2, 5);
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ("Tom", "Allen", 2, 5);