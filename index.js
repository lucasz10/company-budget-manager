// Dependencies
const inquirer = require('inquirer');
const mysql = require('mysql2');
const conTable = require('console.table');

const db = mysql.createConnection(
    {
        hot: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'company_budget_db'
    },
    console.log('Database connection successful!')
)

db.connect(err => {
    if (err) throw err;
    startProg();
})

const startProg = () => {
    inquirer.prompt({
        name: 'startSelect',
        type: 'list',
        message: 'Select an option:',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add Department',
            'Add Role',
            'Add Employee',
            'Change Employee Role',
            'Quit'
        ]
    }).then((input) => {
        switch(input.startSelect) {
            case "View All Departments":
                viewDepts();
                break;
            
            case "View All Roles":
                viewRoles();
                break;

            case "View All Employees":
                viewEmps();
                break;

            case "Change Employee Role":
                updateEmp();
                break;

            case "Add Department":
                addDept();
                break;

            case "Add Role":
                addRole();
                break;

            case "Add Employee":
                addEmp();
                break;

            case "Quit":
                db.end();
                break;
        }
    })
}

function viewDepts() {
    db.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        console.table(results);
        startProg();
    })
}

function viewRoles() {
    db.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON department_id = department.id', (err, results) => {
        if (err) throw err;
        console.table(results);
        startProg();
    })
}

function viewEmps() {
    db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, managers.first_name AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee AS managers ON managers.id = employee.manager_id;', (err, results) => {
        if (err) throw err;
        console.table(results);
        startProg();
    })
}

function updateEmp() {
    db.query("SELECT id, first_name, last_name FROM employee", (err, results) => {
        if (err) throw err;
        const emps = results;
        let empOptions = emps.map(employee => employee.first_name + ' ' + employee.last_name)

        db.query("SELECT id, title FROM role", (err, results) => {
            if (err) throw err;
            const roles = results;
            const roleNames = roles.map(role => role.title);

            inquirer.prompt([
                {
                    name: 'empName',
                    type: 'list',
                    message: 'Please select the employee to update:',
                    choices: empOptions,
                },
                {
                    name: 'newRole',
                    type: 'list',
                    message: 'Please select the new role for the employee:',
                    choices: roleNames,
                },
            ]).then(inputVal => {
                const empId = emps.filter(emp => (emp.first_name + ' ' + emp.last_name) === inputVal.empName).map(emp => emp.id);
                const roleId = roles.filter(role => role.title === inputVal.role).map(role => role.id)

                db.query("UPDATE employee SET role_id = ? WHERE id = ?", [roleId, empId], (err, results) => {
                    if (err) throw err;
                    console.log("Successfully updated " + inputVal.empName + "!")
                    startProg();
                })
            })
        })
    })
}

function addDept() {
    inquirer.prompt([
        {
            name: 'newDept',
            type: 'input',
            message: 'Please enter the new department:',
            validate: (input) => {
                if (input) {
                    return true;
                } else {
                    console.log("Error, no value entered!");
                    console.log("Please enter the new department:");
                }
            }

        }
    ]).then ( inputVal => {
        db.query("INSERT INTO department (name) VALUES (?)", inputVal.newDept, (err, results) => {
            if (err) throw err;
            console.log("Successfully added " + inputVal.newDept + " to database!")
            startProg();
        })
    })
}

function addRole() {
    db.query("SELECT * FROM department", (err, results) => {
        if (err) throw err;
        const depts = results;
        const deptNames = depts.map(dept => dept.name)

        inquirer.prompt([
            {
                name: 'newRole',
                type: 'input',
                message: 'Please enter the new role title:',
                validate: (input) => {
                    if (input) {
                        return true;
                    } else {
                        console.log("Error, no value entered!");
                        console.log("Please enter the new role title:");
                    }
                }
            },
            {
                name: 'newSal',
                type: 'input',
                message: 'Please enter the role salary:',
                validate: (input) => {
                    if (input) {
                        return true;
                    } else {
                        console.log("Error, no value entered!");
                        console.log("Please enter the role salary:");
                    }
                }
            },
            {
                name: 'roleDept',
                type: 'list',
                message: 'Please select the existing department for the role:',
                choices: deptNames,
            }
        ]).then(inputVal => {
            const deptId = depts.filter(dept => dept.name === inputVal.roleDept).map(dept => dept.id);

            db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)" , [inputVal.newRole, parseInt(inputVal.newSal), deptId], (err, results) => {
                if (err) throw err;
                console.log("The new role, " + inputVal.newRole +", has been added!");
                startProg();
            })
        })
    })
}

function addEmp() {
    db.query("SELECT id, title FROM role", (err, results) => {
        if (err) throw err;
        const roles = results;
        const roleNames = roles.map(role => role.title)

        db.query("SELECT id, first_name, last_name FROM employee", (err, results) => {
            if (err) throw err;
            const emps = results;
            let managerOption = emps.map(emp => emp.first_name + ' ' + emp.last_name)

            managerOption.push("No Manager")

            inquirer.prompt([
                {
                    name: 'empFirstName',
                    type: 'input',
                    message: "Please enter employee's first name:",
                    validate: (input) => {
                        if (input) {
                            return true;
                        } else {
                            console.log("Error, no value entered!");
                            console.log("Please enter employee's first name:");
                        }
                    }
                },
                {
                    name: 'empLastName',
                    type: 'input',
                    message: "Please enter employee's last name:",
                    validate: (input) => {
                        if (input) {
                            return true;
                        } else {
                            console.log("Error, no value entered!");
                            console.log("Please enter employee's last name:");
                        }
                    }
                },
                {
                    name: 'empRole',
                    type: 'list',
                    message: "Please select the employee's role:",
                    choices: roleNames,
                },
                {
                    name: 'empManager',
                    type: 'list',
                    message: "Please select the employee's manager. If no manager is applicable, select 'No Manager':",
                    choices: managerOption,
                },
            ]).then(inputVal => {
                const roleId = roles.filter(role => role.title === inputVal.empRole).map(role => role.id)

                var managerId;
                if(inputVal.empManager === "No Manager") {
                    managerId = null;
                } else {
                    managerId = emps.filter(emp => (emp.first_name + ' ' + emp.last_name) === inputVal.managerOption).map(manager => manager.id)
                }

                db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [inputVal.empFirstName, inputVal.empLastName, roleId, managerId], (err, results) => {
                    if (err) throw err;
                    console.log("Successfully added " + inputVal.empFirstName + " " + inputVal.empLastName + " to database!")
                    startProg();
                })
            })
        })
    })
}

