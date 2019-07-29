'use strict';

const authorizer_handler = require('./authorizer_handler.js');
const eventSourcing_handler = require('./eventSourcing_handler.js');
const user_handler = require('./user_handler.js');
const role_handler = require('./role_handler.js');
const auth_handler = require('./auth_handler.js');
const group_handler = require('./group_handler.js');

//module.exports = Object.assign({}, user_handler, role_handler, auth_handler, group_handler, eventSourcing_handler, authorizer_handler);
module.exports = Object.assign({}, user_handler, eventSourcing_handler, authorizer_handler);








