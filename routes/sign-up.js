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

  // Check if password fields match
  if (!(password === confirmPassword)) {
    res.render('sign-up', {message: 'Passwords do not match!'});
    return;
  };

  // Check if username already exists
  User.countDocuments({username: req.body.username}, function(err, count) {
    if (count > 0) {
      res.render('sign-up', {message: 'Username already exists!'});
      return;
    }

    else {
      // Encrypt password and create the user
      bcrypt.hash(`${password}`, 10, (err, hashedPassword) => {
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
          res.redirect("/sign-in");
        })};
      });
    }
  });
})

router.post('/sign-in', function(req, res, next) {

})

module.exports = router;
