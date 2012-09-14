var mongoose = require ("mongoose");

var db = mongoose.createConnection("localhost", "ikstym");

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;


var User = new Schema ({
	username		: {type: String},
	realname		: {type: String},
	guestbookalias	: {type: String},
	pwhash			: {type: String},
	email			: {type: String},
	phone			: {type: String},
});

exports.user = db.model('User', User);
