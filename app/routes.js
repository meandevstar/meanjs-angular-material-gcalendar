var path = require('path');
var User = require('../app/models/user');
var configAuth = require('../config/auth');
var config = require('../config/config');


module.exports = function(app, passport) {

    var SCOPES = [ 'https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/userinfo.email',                    
                    'https://www.googleapis.com/auth/calendar'];

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/isloggedin', function(req, res) {
        
        if (req.user === undefined) {
            res.json('failed');
        } else {            
            if(req.isAuthenticated()){
            //if user is looged in, req.isAuthenticated() will return true 
                res.json('success');
            } else{
                res.json('failed');
            }
        } 
    });


	app.get('/auth/google', passport.authenticate('google', { scope : SCOPES, accessType: 'offline', approvalPrompt: 'force' }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback', function (req, res, next) {
        passport = req._passport.instance;
        passport.authenticate('google',function(err, user, info) {
        console.log('1');
            
		if(err) {
			return next(err);
		}
		if(!user) {
			return res.redirect('/');
		}
		User.findOne({email: user.email},function(err,usr) {
            console.log('2');
            
            var homeURL = config.siteURL + '/#!/home';
            console.log(homeURL);
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                res.writeHead(302, {
                    'Location': homeURL
                });
                res.end();
            });
		});
    })(req,res,next)});

};