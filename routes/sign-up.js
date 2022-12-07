var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user_model');



// GET requests to render pages
router.get('/', function(req, res, next) {
  res.redirect('/sign-up');
})

router.get('/sign-up', function(req, res, next) {
  res.render('sign-up');
});

router.get('/sign-in', function(req, res, next) {
  res.render('sign-in');
})



// POST requests to submit a form
router.post('/sign-up', function(req, res, next) {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  console.log(req.body);
  if (password === confirmPassword) {
    const pass = bcrypt.hash(`${password}`, 10, (err, hashedPassword) => {
      if(err) {
        return next(err);
      }
      else {
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
      }).save(err => {
        if (err) { 
          return next(err);
        }
        res.redirect("/");
      })};
    });
  }
  else {
    res.render('sign-up', {message: 'Passwords do not match!'});
  }
})

router.post('/sign-in', function(req, res, next) {

})

module.exports = router;
