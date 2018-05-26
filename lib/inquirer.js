const inquirer = require('inquirer');

module.exports = {
    newUser: () => {
        const questions = [{
            type: 'list',
            name: 'newuser',
            message: 'Select:',
            choices: ['Login', 'Sign Up'],
            default: 'Login'
        }];
        return inquirer.prompt(questions);
    },
    askLoginCredentials: () => {
        const questions = [{
                    name: 'username',
                    type: 'input',
                    message: 'Choose your username:',
                    validate: function (value) {
                        if (value.length) {
                            return true;
                        } else {
                            return 'Please choose your username.';
                        }
                    }
                }, {
                name: 'email',
                type: 'input',
                message: 'Enter your e-mail address:',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter e-mail address.';
                    }
                }
            },
            {
                name: 'password',
                type: 'password',
                message: 'Choose your password (min 6):',
                validate: function (value) {
                    if (value.length >= 6) {
                        return true;
                    } else {
                        return 'Please choose your password (min 6).';
                    }
                }
            },{
                name: 'cpassword',
                type: 'password',
                message: 'Confirm password:',
                validate: function (value) {
                    if (value.length >= 6) {
                        return true;
                    } else {
                        return 'Please confirm your password.';
                    }
                }
            }
        ];
        return inquirer.prompt(questions);
    },
    askAim: () => {
        const questions = [{
            type: 'list',
            name: 'aim',
            message: 'What do you want to do:',
            choices: ['Join Group','Create New Group'],
            default: 'Join Group'
        }];
        return inquirer.prompt(questions);
    },
    createGroup: () =>{
        const questions = [{
                    type: 'list',
                    name: 'category',
                    message: 'Select group category:',
                    choices: ['Discussion Group', 'Club', 'Social Group', 'Other'],
                    default: 'Discussion Group'
                },
                {
                name: 'name',
                type: 'input',
                message: 'Enter Group Name:',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter Group Name.';
                    }
                }
            },
            {
                name: 'department',
                type: 'input',
                message: 'Enter your ***Department:',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your ***Department.';
                    }
                }
            }
        ];
        return inquirer.prompt(questions);
    },
    selectGroup: (groups) => {
        const groupNames = groups.map(group => group.name);
        const questions = [{
            type: 'list',
            name: 'name',
            message: 'Select group:',
            choices: groupNames,
            default: [0]
        }];
        return inquirer.prompt(questions);
    }
}