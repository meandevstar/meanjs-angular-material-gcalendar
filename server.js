// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var passport       = require('passport');
var flash          = require('connect-flash');
var session        = require('express-session');

var config = require('./config/config.js');
require('./config/passport')(passport);


// configuration ===========================================
	
var port = process.env.PORT || 8080; // set our port
mongoose.connect(config.dbURL); // connect to our mongoDB database (commented out after you enter in your own credentials)

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

// required for passport
app.use(session({ 
  secret: 'googlegooglegooglecalendar',
  resave: true,
  saveUninitialized: true
 })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Add headers
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// routes ==================================================
require('./app/routes')(app, passport);
var apis = require('./app/routes/api');

app.use('/api', apis);

// start app ===============================================
app.listen(port);	
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app