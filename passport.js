const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/user_model');

passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) { 
          return done(err);
        }
        if (!user) {
          console.log('user not found');
          return done(null, false, { message: "Incorrect username" });
        }
        console.log('user found');
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            console.log('password matches');
            // passwords match! log user in
            return done(null, user)
          } else {
            console.log('password does not match');
            // passwords do not match!
            return done(null, false, { message: "Incorrect password" })
          }
        })
      });
    })
  );
  
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
    
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  module.exports = passport;