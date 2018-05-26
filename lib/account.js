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
            return 'Logging In';
        }else {
            const cred = await inquirer.askLoginCredentials();
            if (!(validator.isEmail(cred.email))) {
                error(`'${cred.email}' is not a valid email address`);
                process.exit(1);
            }
            if (!(validator.equals(cred.password, cred.cpassword))) {
                error(`Sorry '${cred.password}' ≠ '${cred.cpassword}'`);
                process.exit(1);
            }
            var username = validator.blacklist(cred.username, '.');
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
            return signup;
        }
    },

    registerNewToken: async () => {
        const status = new Spinner('Authenticating you, please wait...');
        status.start();

        try {
            const response = await octokit.authorization.create({
                scopes: ['user', 'public_repo', 'repo', 'repo:status'],
                note: 'ginits, the command-line tool for initalizing Git repos'
            });
            const token = response.data.token;
            if (token) {
                conf.set('github.token', token);
                return token;
            } else {
                throw new Error("Missing Token", "Github token was not found in the response");
            }
        } catch (err) {
            throw err;
        } finally {
            status.stop();
        }
    },

    githubAuth: (token) => {
        octokit.authenticate({
            type: 'oauth',
            token: token
        });
    },

    getStoredGithubToken: () => {
        return conf.get('github.token');
    },

    hasAccessToken: async () => {
        const status = new Spinner('Authenticating you, please wait...');
        status.start();

        try {
            const response = await octokit.authorization.getAll();
            const accessToken = _.find(response.data, (row) => {
                if (row.note) {
                    return row.note.indexOf('ginit') !== -1;
                }
            });
            return accessToken;
        } catch (err) {
            throw err;
            m
        } finally {
            status.stop();
        }
    },

    regenerateNewToken: async (id) => {
        const tokenUrl = 'https://github.com/settings/tokens/' + id;
        console.log('Please visit ' + chalk.underline.blue.bold(tokenUrl) + ' and click the ' + chalk.red.bold('Regenerate Token Button.\n'));
        const input = await inquirer.askRegeneratedToken();
        if (input) {
            conf.set('github.token', input.token);
            return input.token;
        }
    }

};