const Configstore = require('configstore');
const pkg = require('../package.json');
const CLI = require('clui');
const Spinner = CLI.Spinner;
const chalk = require('chalk');

const inquirer = require('./inquirer');
const database = require("./database");
const validator = require('validator');

const conf = new Configstore(pkg.name);
function success(data) {
    console.log(chalk.green(data));
}

function error(error) {
    console.log(chalk.red(error));
}

module.exports = {

    getInstance: () => {
        return conf.get('account');
    },
    userAction: async (choice) => {
        if(choice === 'Login'){
            const lcred = await inquirer.askLoginCredentials();
            var loader = new Spinner(`Signing up, please wait...`);
            loader.start();
            const login = await database.signIn(lcred.email, lcred.password);
            loader.stop();
            if ('code' in login) {
                console.log(signup.message);
                process.exit(1);
            }
            let account = {
                username: login.user.displayName,
                email: login.user.email
            }
            conf.set('account', account);
            return account;
        }else {
            const cred = await inquirer.askSignupCredentials();
            if (!(validator.isEmail(cred.email))) {
                error(`'${cred.email}' is not a valid email address`);
                process.exit(1);
            }
            if (!(validator.equals(cred.password, cred.cpassword))) {
                error(`Sorry '${cred.password}' ≠ '${cred.cpassword}'`);
                process.exit(1);
            }
            var username = validator.blacklist(cred.username, '.#$\[\]@');
            var verifyUsername = await database.getUserName(username);
            if (verifyUsername.length){
                error(`Sorry '${username}' is already taken`);
                process.exit(1);
            }
            var loader = new Spinner(`Signing up, please wait...`);
            loader.start();
            const signup = await database.signUp(cred.email, cred.password, cred.username);
            loader.stop();
            if(typeof signup === 'boolean'){
                delete cred.password
                delete cred.cpassword
                conf.set('account', cred);
            }else{
                if('message' in signup){
                    error(signup.message);
                }else{
                    error('Sorry there was an error please try again');
                }
                process.exit(1);
            }
            return cred;
        }
    }
};