INSERT INTO department (name)
VALUES  ("Sales"),
        ("Design"),
        ("Project Management"),
        ("Field Installation")

INSERT INTO roles (title, salary, department_id)
VALUES  ("Sales Lead", 120000, 1),
        ("Salesperson", 80000, 1),
        ("Junior Engineer", 60000, 2),
        ("Senior Engineer", 100000, 2),
        ("Design Manager", 160000, 2),
        ("Tenant Improvement PM", 115000, 3),       
        ("New Construction PM", 140000, 3),
        ("Field Foreman", 55000, 4),
        ("Apprentice Fitter", 40000, 4),
        ("Field Superintendent", 130000, 4)

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("John", "Doe", 1, NULL),
        ("Mike", "Chan", 2, 1),
        ("Ashley", "Jane", 5, NULL),
        ("James", "Dean", 4, 3),
        ("Richard", "Dickins", 3, 3),
        ("Sally", "Roberts", 10, NULL),
        ("Sue", "Stevens", 8, 6),
        ("Dane", "Ramsey", 9, 7)