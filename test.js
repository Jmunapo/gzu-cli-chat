const Configstore = require('configstore');
const pkg = require('./package.json');

// create a Configstore instance with an unique ID e.g.
// Package name and optionally some default values
const conf = new Configstore(pkg.name);

console.log(conf.get('password'));

conf.set('account', {
    username: 'joe',
    id: 'dwdgdggdgggGGGGHGHVVBDSGHGHDHGDGH'
});
console.log(conf.get('account'));
//=> true
conf.delete('account');