var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.redirect('/sign-up');
})

router.get('/sign-up', function(req, res, next) {
  res.render('sign-up');
});

router.get('/sign-in', function(req, res, next) {
  res.render('sign-in');
})

module.exports = router;
