var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user_model');
const Message = require('../models/message_model');
const passport = require('../passport');



// GET requests to render pages ---------------------------------------------------------------------------------------------------------------
router.get('*', function(req, res, next) {
  res.locals.loggedIn = (req.user) ? true : false;
  res.locals.user = req.user || null;
  next();
})

router.get('/', function(req, res, next) {
  res.redirect('/forum');
})

router.get('/forum', function(req, res, next) {
  Message.find({})
  .sort({date: -1})
  .exec(function(err, messages) {
    if (err) {
      return next(err);
    }
    res.render('index', {messages: messages});
  })
})

router.get('/sign-up', function(req, res, next) {
  res.render('sign-up');
});

router.get('/log-in', function(req, res, next) {
  res.render('log-in');
})

router.get('/forum/new-message', function(req, res, next) {
  res.render('new-message');
})

// Catch all route to redirect all unwanted URLs back to the index
router.get('*', function(req, res, next) {
  res.redirect('/')
})



// POST requests to submit a form ---------------------------------------------------------------------------------------------------------------
router.post('/sign-up', function(req, res, next) {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

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
          res.redirect("/log-in");
        })};
      });
    }
  });
})

router.post('/log-in', function(req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in"
  })(req, res, next);
})

router.post('/log-out', function(req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
})

router.post('/forum/new-message', function(req, res, next) {
  // Create and save new message
  const username = req.body.username;
  const date = new Date();
  const text = req.body.text;
  const message = new Message({
    username,
    date,
    text
  });
  message.save((err) => {
    if (err) {
      return next(err);
    }
  });

  res.redirect('/forum');
})

router.post('/forum/delete-message', function(req, res, next) {
  Message.findOneAndRemove({_id: req.body.id}, function(err) {
    if(err) {
      return next(err);
    }
    res.redirect('/');
  })
})

module.exports = router;
