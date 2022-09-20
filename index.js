// Dependencies
const inquirer = require('inquirer');
const mysql = require('mysql');
const conTable = require('console.table');

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
    
}