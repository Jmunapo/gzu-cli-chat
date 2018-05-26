const program = require('commander');
const {
    prompt
} = require('inquirer');

function runCommand(name){
    console.log(name);
}

program
    .version('0.0.1')
    .description('GZU Command Line Interface Chat')

program
    .command('startChat')
    .alias('s')
    .description('Add a contact')
    .action(() => {
        runCommand('My command');
    });

// Assert that a VALID command is provided 
if (!process.argv.slice(2).length || !/[arudl]/.test(process.argv.slice(2))) {
    program.outputHelp();
    process.exit();
}
program.parse(process.argv)