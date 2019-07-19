var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

//USER 
router.get('/USER_index', function (req, res) {
  res.render('USER_home', {
  	pageAggregate: 'user'
  });
});

router.get('/CREATE_user', function (req, res) {
  res.render('CREATE_USER', {
  	pageAggregate: 'user'
  });
});

router.get('/READ_user', function (req, res) {
  res.render('READ_USER', {
  	pageAggregate: 'user'
  });
});

router.get('/UPDATE_user', function (req, res) {
  res.render('UPDATE_USER', {
  	pageAggregate: 'user'
  });
});

router.get('/DELETE_user', function (req, res) {
  res.render('DELETE_USER', {
  	pageAggregate: 'user'
  });
});

//ROLE
router.get('/ROLE_index', function (req, res) {
  res.render('ROLE_home', {
  	pageAggregate: 'role'
  });
});

router.get('/CREATE_role', function (req, res) {
  res.render('CREATE_ROLE', {
  	pageAggregate: 'role'
  });
});

router.get('/READ_role', function (req, res) {
  res.render('READ_ROLE', {
  	pageAggregate: 'role'
  });
});

router.get('/UPDATE_role', function (req, res) {
  res.render('UPDATE_ROLE', {
  	pageAggregate: 'role'
  });
});

router.get('/DELETE_role', function (req, res) {
  res.render('DELETE_ROLE', {
  	pageAggregate: 'role'
  });
});

//AUTHORIZATION
router.get('/AUTH_index', function (req, res) {
  res.render('AUTH_home', {
  	pageAggregate: 'auth'
  });
});

router.get('/CREATE_auth', function (req, res) {
  res.render('CREATE_AUTH', {
  	pageAggregate: 'auth'
  });
});

router.get('/READ_auth', function (req, res) {
  res.render('READ_AUTH', {
  	pageAggregate: 'auth'
  });
});

router.get('/UPDATE_auth', function (req, res) {
  res.render('UPDATE_AUTH', {
  	pageAggregate: 'auth'
  });
});

router.get('/DELETE_auth', function (req, res) {
  res.render('DELETE_AUTH', {
  	pageAggregate: 'auth'
  });
});

//GROUP
router.get('/GROUP_index', function (req, res) {
  res.render('GROUP_home', {
  	pageAggregate: 'group'
  });
});

router.get('/CREATE_group', function (req, res) {
  res.render('CREATE_GROUP', {
  	pageAggregate: 'group'
  });
});

router.get('/READ_group', function (req, res) {
  res.render('READ_GROUP', {
  	pageAggregate: 'group'
  });
});

router.get('/UPDATE_group', function (req, res) {
  res.render('UPDATE_GROUP', {
  	pageAggregate: 'group'
  });
});

router.get('/DELETE_group', function (req, res) {
  res.render('DELETE_GROUP', {
  	pageAggregate: 'group'
  });
});


module.exports = router;
