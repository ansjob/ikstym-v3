var dbLib = require("logic/db");

var db = dbLib.db;

module.exports = {
	insert : function(rsvp, callback) {
		var error = this.validate(rsvp);
		if (error) callback(error)
		else {
			var sqlParams = {};
			for (var propName in exports._properties) {
				sqlParams["$" + propName] = rsvp[propName];
			}
			db.run(exports._insert_stmt, sqlParams, callback);
		}
	},
	validate : function(rsvp) {
		return undefined;
	},
	search : function(params, callback) {
		var sql;
		if (params.event_id) {
			var event_id = parseInt(params.event_id);
			if (event_id) {
				sql = "select * from rsvp where event_id = " + event_id + " order by timestamp asc";
				this.getFromSql(sql, {}, callback);
			} else {
				callback("Kunde inte läsa event-id't");
			}
		}
	},
	getFromSql : function(sql, options, callback) {
		db.all(sql, callback);
	}
};

exports._properties = {
	"event_id"	: {type : "integer", primaryKey: true, foreignKey : "calendar(id)"},
	"username"	: {type : "text", primaryKey : true, foreignKey : "user(username)"},
	"attending" : {type : "integer"},
	"comment"	: {type : "text"},
	"guests"	: {type : "integer"},
	"timestamp"	: {type : "integer"}
}

var create_stmt = dbLib.creationStatement("rsvp", exports._properties);
exports._insert_stmt = dbLib.insertStatement("rsvp", exports._properties);

dbLib.initQueries.push(create_stmt);
