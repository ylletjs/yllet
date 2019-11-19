const config = require('../../rollup.config.js');
const pkg = require('./package.json');

module.exports = config(pkg);
