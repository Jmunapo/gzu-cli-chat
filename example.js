const program = require('commander');

program
    .version('0.0.1')
    .description('GZU Command Line Interface 1 ~ by joemags');

program
    .command('gzu <chat>')
    .alias('c')
    .description('GZU CHAT')
    .action(name => getContact(name));

program.parse(process.argv);