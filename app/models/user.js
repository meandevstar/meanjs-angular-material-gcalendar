// User Schema
//
// 

var mongoose = require('mongoose');

var schema =  new mongoose.Schema(
	{
		google_id: {type: String}
		,name: {type: String,}
		,email: {type: String,}
		,token: {type: String, required: false}
		,refreshToken: {type: String, required: false}
	}
);

module.exports = mongoose.model('User', schema);
