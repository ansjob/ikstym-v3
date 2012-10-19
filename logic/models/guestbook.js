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
		this.getFiltered(function(entry) {
			return true;
		}, callback);
	},

	getFiltered : function(filter, callback) {
		db.all("select * from guestbook order by id desc", function (error, entries) {
			var outstanding_reqs = 0, some_error, loop_done = false;
			var filtered = [];
			for (idx in entries) {
				if (some_error) break;

				//This needs to go in a function scope in order to capture
				// the entry variable for the callback
				(function() {
				var entry = entries[idx];
				if (filter(entry)) {
					filtered.push(entry);
					if (entry.username) {
						delete entry.alias;
						outstanding_reqs++;
						users.getByUsername(entry.username,
						function(error, user) {
							some_error = some_error || error;
							entry.userdata = user;
							if (--outstanding_reqs == 0 && loop_done) {
								callback(some_error, filtered);
							}
						});
						delete entry.username;
					}
				}
				})();
			}
			loop_done = true;
			if (some_error || (outstanding_reqs == 0 && true))
				callback(some_error, filtered);
		});
	},

	deleteEntry: function(id, callback) {
		id = parseInt(id);
		db.run("delete from guestbook where id = $id", {$id : id}, callback);
	} 
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
