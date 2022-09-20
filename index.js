// Dependencies
const inquirer = require('inquirer');
const mysql = require('mysql');
const conTable = require('console.table');
const { default: InputPrompt } = require('inquirer/lib/prompts/input');

const db = mysql.createConnection(
    {
        hot: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'company_budget_tracker'
    },
    console.log('Database connection successful!')
)

db.connect(err => {
    if (err) throw err;
    startProg();
})

const startProg = () => {
    inquirer.prompt({
        name: 'startProg',
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
        switch(startProg.input) {
            case "View All Departments":
                viewDepts();
                break;
            
            case "View All Roles":
                viewRoles();
                break;

            case "View All Employees":
                viewEmps();
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

            case "Change Employee Role":
                updateEmp();
                break;

            case "Quit":
                db.end();
                break;
        }
    })
}

viewDepts = () => {
    db.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        console.table(results);
        startProg();
    })
}

viewRoles = () => {
    db.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON department_id = department.id', (err, results) => {
        if (err) throw err;
        console.table(results);
        startProg();
    })
}

viewEmps = () => {
    db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, managers.first_name AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee AS managers ON managers.id = employee.manager_id;', (err, results) => {
        if (err) throw err;
        console.table(results);
        startProg();
    })
}

addDept = () => {
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
            if(err) throw err;
            console.log("Successfully added " + inputVal.newDept + " to database!")
            startProg();
        })
    })
}

addRole = () => {
    db.query("SELECT * FROM department", (err, results) => {
        if(err) throw err;
        const depts = results;
        const deptNames = depts.map(department => department.name)

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
            const deptId = depts.filter(department => department.name === inputVal.roleDept).map(department => department.id);

            db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)" , [inputVal.newRole, parseInt(inputVal.newSal), deptId], (err, results) => {
                if (err) throw err;
                console.log("The new role, " + inputVal.newRole +", has been added!");
                startProg();
            })
        })
    })
}

