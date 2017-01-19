// config/passport.js

// var FacebookStrategy = require('passport-facebook').Strategy;
// var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var refresh = require('passport-oauth2-refresh');

// load up the user model
var User       = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        // console.log('serializeUser...');
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            // console.log('deserializeUser...');
            done(err, user);
        });
    });
    
    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))
    // code for facebook (use('facebook', new FacebookStrategy))
    // code for twitter (use('twitter', new TwitterStrategy))

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================

    var strategy = new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    }, function(token, refreshToken, profile, done) {

                // make the code asynchronous
                // User.findOne won't fire until we have all our data back from Google
                process.nextTick(function() {

                    // try to find the user based on their google id
                    User.findOne({ 'google_id' : profile.id }, function(err, user) {
                        if (err)
                            return done(err);

                        if (user) {
                            // console.log("User Found!!");

                            // if a user is found, log them in
                            return done(null, user);
                        } else {
                            // if the user isnt in our database, create a new user
                            var newUser          = new User();

                            // set all of the relevant information
                            console.log("Token : ");
                            console.log(token);
                            newUser.google_id    = profile.id;
                            newUser.token = token;
                            newUser.refreshToken = refreshToken;
                            newUser.name  = profile.displayName;
                            newUser.email = profile.emails[0].value; // pull the first email

                            // save the user
                            newUser.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }
                    });
                });

            });
            
  passport.use(strategy);
  refresh.use(strategy);

};
