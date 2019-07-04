'use strict';

const user_handler = require('./user_handler.js');
const role_handler = require('./role_handler.js');
const auth_handler = require('./auth_handler.js');

module.exports = Object.assign({}, user_handler, role_handler, auth_handler);








