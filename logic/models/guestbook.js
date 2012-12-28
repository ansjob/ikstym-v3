var users = require("logic/models/users"),
	dbLib = require("logic/db"),
	db = dbLib.db;

module.exports = {

	insert : function(entry, callback) {
		var sqlParams = {};
		for (var propName in exports._properties) {
			var property = exports._properties[propName];
			sqlParams["$" + propName] = entry[propName];
		}
		db.run(exports._INSERT_ENTRY_STMT,
			sqlParams, callback);
	},

	deleteAll: function(callback) {
		db.run("delete from guestbook where 1=1", callback);
	},

	getAll: function(callback) {
		var sql = "select * from guestbook order by id desc";
		this.getFromSql(sql, callback);
	},

	deleteEntry: function(id, callback) {
		id = parseInt(id);
		db.run("delete from guestbook where id = $id", {$id : id}, callback);
	},

	getPage : function(pageNum, callback) {
		var limit = this.PAGE_SIZE,
			offset = parseInt(pageNum) || 0;
		var sql = "select * from guestbook order by id desc limit {limit} offset {offset}"
			.replace("{limit}", limit).replace("{offset}", offset);
		this.getFromSql(sql, callback);
	},

	getSingleEntry : function(id, callback) {
		id = parseInt(id);
		if (id) {
			var sql = "select * from guestbook where id = {id}".
				replace("{id}", id);
			this.getFromSql(sql, callback);
		} else {
			callback("Ogiltigt ID: " + id, null);
		}
	},

	getFromSql : function(sql, callback) {
		db.all(sql, function(error, entries) {
			var outstanding = 0, some_error, loop_done = false;
			for (var i in entries) {
				if (some_error) break;
				//This needs to go in a function scope in order to capture
				// the entry variable for the callback
				(function() {
					var entry = entries[i];
					if (entry.username) {
						delete entry.alias;
						outstanding++;
						users.getByUsername(entry.username, function(u_error, user) {
							some_error = some_error || u_error;
							entry.userdata = user;
							if(--outstanding == 0 && loop_done) {
								callback(some_error, entries);
							}
						});
					}
				})();
			}
			loop_done = true;
			if (some_error || outstanding == 0) {
				callback(some_error, entries);
			} 
		});
	},

	PAGE_SIZE : 20
};

exports._properties = {
	id 			: {type: "integer", primaryKey: true},
	"timestamp"	: {type: "integer"},
	"alias"		: {type: "string"},
	"text"		: {type: "string"},
	"ip"		: {type: "string"},
	"username"	: {type: "string"},
};

var stmt = "create table if not exists guestbook (";
var idx = 0;
for (var propName in exports._properties) {
	var prop = exports._properties[propName];
	if (idx != 0) stmt +=", ";
	stmt += propName + " " + prop.type;
	if (prop.primaryKey) stmt += " primary key ";
	idx++;
};
stmt += ")";

dbLib.initQueries.push(stmt);

var insert_stmt = "INSERT INTO guestbook values(";

var idx = 0;
for (var propName in exports._properties) {
	var property = exports._properties[propName];
	if (idx++ != 0) insert_stmt +=", ";
	insert_stmt += "$" + propName;
}

insert_stmt += ")";

exports._INSERT_ENTRY_STMT = insert_stmt;
