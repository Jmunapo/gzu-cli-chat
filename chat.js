#!/usr/bin/env node

const chalk = require('chalk'); //colorizes the output
const clear = require('clear'); //clears the terminal screen
const figlet = require('figlet'); //creates ASCII art from text
const program = require('commander');
const CLI = require('clui');
const Spinner = CLI.Spinner;

//const readline = require('readline');
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

function success(data){
    console.log(chalk.green(data));
}

function error(error){
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
        figlet.textSync('CLI-CHAT', {
            horizontalLayout: 'full'
        })
    )
);

const run = async () => {
    var gropName = "";
    //Sign in ===>
    try {
        var user = await account.getInstance();
        if(!user){
            const newuser = await inquirer.newUser();
            user = await account.userAction(newuser.newuser);
            clear();
        }
        success(`Welcome: ${user.username}`);
        const aim = await inquirer.askAim();
        if (aim.aim === "Join Group") {
            const groups = await database.getGroups();
            if (groups) {
                const group = await inquirer.selectGroup(groups);
                gropName = group.name;
            }else{
                error('There are no groups available, please add group');
                process.exit(1)
            }
        } else {
            const group = await inquirer.createGroup();
            group.name = validator.blacklist(group.name, '.#$\[\]@');
            const status = new Spinner(`Creating ${group.name}, please wait...`);
            status.start();
            const addGroup = await database.push('groups', group);
            status.stop();
            gropName = group.name;
        }
        clear();
        //Online Notification
        const online = await database.setOnline(gropName, user.username);
        database.checkOnline(gropName, user.username);
        const chat = await database.getChats(gropName, user.username);

        var readline = require('readline'),
            rl = readline.createInterface(process.stdin, process.stdout),
            prefix = 'Type a message> ';

        rl.on('line', async message => {
            var message = {
                sender: user.username,
                message: message,
                timestamp: new Date().getTime()
            }
            const send = await database.sendMessage(gropName, message);
            rl.setPrompt(prefix, prefix.length);
            rl.prompt();
        }).on('close', function () {
            console.log('Have a great day!');
            process.exit(0);
        });
        rl.setPrompt(prefix, prefix.length);
        setTimeout(()=>{
            rl.prompt();
        }, 400)
        
        /*const input = readline.createInterface({
            input: process.stdin
        });
        input.on('line', async message => {
            var message = {
                sender: user.username,
                message: message,
                timestamp: new Date().getTime()
            }
            //input.setPrompt(prefix);
            const send = await database.sendMessage(gropName, message);
        });*/

    } catch (error) {
        if('code' in error){
            console.log(chalk.red(error.message));
        }else{
            console.log(error);
        }
        process.exit(1)
    }
}

run();

program
    .version('0.0.1')
    .description('GZU Command Line Interface 1 ~ by joemags');

program
    .command('gzu')
    .alias('c')
    .description('GZU CHAT')
    .action(chat => run());

program.parse(process.argv);