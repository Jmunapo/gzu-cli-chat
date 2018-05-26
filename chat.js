const chalk = require('chalk'); //colorizes the output
const clear = require('clear'); //clears the terminal screen
const figlet = require('figlet'); //creates ASCII art from text
const CLI = require('clui');
const Spinner = CLI.Spinner;

const readline = require('readline');
const validator = require('validator');
//https://www.smashingmagazine.com/2017/03/interactive-command-line-application-node-js/
//https://scotch.io/tutorials/build-an-interactive-command-line-application-with-nodejs
//https://www.sitepoint.com/javascript-command-line-interface-cli-node-js/
//https://github.com/tj/commander.js/
//https://appliedgo.net/tui/
//https://github.com/yaronn/blessed-contrib
const inquirer = require('./lib/inquirer');
const database = require("./lib/database");
const account = require("./lib/account");

function writeDone(data){
    console.log(chalk.green(data));
}

function writeError(error){
    console.log(chalk.red(error));
}

function terminate() {
    term.grabInput(false);
    setTimeout(function () {
        process.exit()
    }, 100);
}
clear();
console.log(
    chalk.yellow(
        figlet.textSync('GZU-CLI-CHAT', {
            horizontalLayout: 'full'
        })
    )
);

const run = async () => {
    var gropName = "";
    var myName = "Joe";
    //Sign in ===>
    try {
        const user = await account.getInstance();
        console.log(user);
        if(!user){
            const newuser = await inquirer.newUser();
            const userAction = await account.userAction(newuser.newuser);
            console.log(userAction);
        }
        process.exit(1);
        const cred = await inquirer.askLoginCredentials();
        if (!(validator.isEmail(cred.email))) {
            writeError(`'${cred.email}' is not a valid email address`);
            process.exit(1);
        }
        if (!(validator.equals(cred.password, cred.cpassword))){
            writeError(`Sorry '${cred.password}' ≠ '${cred.cpassword}'`);
            process.exit(1);
        }
        var loader = new Spinner(`Signing up, please wait...`);
        loader.start();
        const signup = await database.signUp(cred.email, cred.password);
        console.log(signup.user);
        loader.stop();
        process.exit(1);
        const aim = await inquirer.askAim();
        if (aim.aim === "Join Group") {
            const groups = await database.getGroups();
            if (groups) {
                const group = await inquirer.selectGroup(groups);
                clear();
                //Online Notification
                const chat = await database.getChats(group.name);
                gropName = group.name;
                const input = readline.createInterface({
                    input: process.stdin
                })
                input.on('line', async message=>{
                    var message = {
                        sender: myName,
                        message: message
                    }
                    const send = await database.sendMessage(gropName, message);
                });
            }
        } else {
            const group = await inquirer.createGroup();
            group.name = validator.blacklist(group.name, '.')
            console.log(group.name);
            const status = new Spinner(`Creating ${group.name}, please wait...`);
            status.start();
            const addGroup = await database.push('groups', group);
            status.stop();
        }
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}
run();