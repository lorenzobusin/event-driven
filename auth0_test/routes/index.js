var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/USER_index', function (req, res) {
  res.render('USER_index');
});

router.get('/CREATE_user', function (req, res) {
  res.render('CREATE_user');
});

router.get('/READ_user', function (req, res) {
  res.render('READ_user');
});

router.get('/DELETE_user', function (req, res) {
  res.render('DELETE_user');
});


module.exports = router;
