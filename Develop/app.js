const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const team = [];

function promptManager() {
    return inquirer.prompt([{
            type: 'input',
            message: 'What is the name of the Manager?',
            name: 'name',
            validate: async function(input) {
                if (input.trim() === '') {
                    return 'You need to Enter a valid name.'
                }
            }
        },
        {
            type: 'input',
            message: 'What is your ID?',
            name: 'id'
        },
        {
            type: 'input',
            message: 'What is your email address?',
            name: 'email'
        },
        {
            type: 'input',
            message: 'What is your office number?',
            name: "officeNumber"
        }
    ]);
};

function confirmEmp() {
    return inquirer.prompt([{
        type: 'confirm',
        message: 'Do you want to add a new employee?',
        name: 'addNewEmp'
    }]);
};

function addNewEmployee() {
    return inquirer.prompt([{
            type: 'list',
            message: "What is your role?",
            choices: [
                "Engineer",
                "Intern"
            ],
            name: 'empRole'
        },
        {
            type: 'input',
            message: 'What is your name?',
            name: 'empName'
        },
        {
            type: 'input',
            message: 'What is your ID?',
            name: 'empId'
        },
        {
            type: 'input',
            message: 'What is your email address?',
            name: 'empEmail'
        },
        {
            type: 'input',
            message: 'What is your Github user name?',
            name: 'empGithub',
            when: (input) => input.empRole === "Engineer"
        },
        {
            type: 'input',
            message: 'What school did you attend?',
            name: 'empSchool',
            when: (input) => input.empRole === 'Intern'
        }
    ]);
};



async function init() {
    try {
        const answers = await promptManager();

        manager = new Manager(
            answers.name,
            answers.id,
            answers.email,
            answers.officeNumber
        );

        team.push(manager);

        createNewEntry();

        async function createNewEntry() {
            const confirmE = await confirmEmp();

            if (confirmE.addNewEmp) {
                const newEmployee = await addNewEmployee();
                // console.log(newEmployee);
                if (newEmployee.empRole === 'Engineer') {
                    team.push(
                        new Engineer(
                            newEmployee.empName,
                            newEmployee.empId,
                            newEmployee.empEmail,
                            newEmployee.empGithub
                        )
                    )
                };

                if (newEmployee.empRole === 'Intern') {
                    team.push(
                        new Intern(
                            newEmployee.empName,
                            newEmployee.empId,
                            newEmployee.empEmail,
                            newEmployee.empSchool
                        )
                    );
                };

                createNewEntry();
            };
            if (!confirmE.addNewEmp) {
                // console.log('this is the new team', team);
                const testing = render(team);
                console.log(testing);
                fs.writeFile(outputPath, testing, err => {
                    if (err) throw err;
                    console.log("Your file has been created!");
                });
            };
        };


    } catch (err) {
        if (err) console.log(err);
    };
};

// validation functions

// const confirmRealName = async(input) => {
//     if (input.trim() === '') return 'Please enter a valid name';
// };

// run the init function
init();


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```