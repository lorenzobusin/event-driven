var express = require('express');
var secured = require('../lib/middleware/secured');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

//USERS
router.get('/profile', secured(), function (req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  res.render('profile_home', {
    userProfile: JSON.stringify(userProfile, null, 2),
    navActive: 'profile'
  });
});

router.get('/update', function (req, res) {
  res.render('update_home', {
    navActive: 'update'
  });
});

router.get('/signin', function (req, res) {
  res.render('signin_home')
});


module.exports = router;
