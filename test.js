const Configstore = require('configstore');
const pkg = require('./package.json');
var moment = require('moment');

const conf = new Configstore(pkg.name);

conf.delete('account');


