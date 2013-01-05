var dbLib = require("logic/db"),
	db = dbLib.db;

module.exports = {
	getAll : function(callback) {
		var sql = "select * from calendar order by start asc";
		this.getFromSql(sql, callback);
	},

	getFromSql : function(sql, callback) {
		db.all(sql, callback);
	},

	deleteAll : function(callback) {
		db.run("delete from calendar where 1=1", callback);
	},

	insert : function(ev, callback) {
		var error = this.validate(ev);
		if (error) {
			callback(ev);
		}
		else {
			var sqlParams = {};
			for (var propName in exports._properties) {
				var property = exports._properties[propName];
				sqlParams["$" + propName] = ev[propName];
			}
			db.run(exports._INSERT_ENTRY_STMT,
				sqlParams, callback);
		}
	},

	getTimeInterval : function(options, callback) {
		var from = parseInt(options.from);
		var to = parseInt(options.to);
		if (!from || !to) {
			callback("Både från och till-datum måste anges");
		}
		else {
			var sql = "select * from calendar start where start >= $from and start <= $to order by start asc".replace("$from", from).replace("$to", to);
			this.getFromSql(sql, callback);
		}
	}, 

	validate : function(ev) {
		if (ev.start > ev.end) return "Event kan inte börja efter att det slutar";
		if (!ev.title) return "Event måste ha en titel";
		if (!ev.title) return "Event måste ha en titel";
		if (!ev.location) return "Eventet måste ha en plats angiven";
	}
};

exports._properties = {
	"id"			: {type: "integer", primaryKey: true},
	"start"			: {type: "integer"},
	"end"			: {type: "integer"},
	"title"			: {type: "text"},
	"description"	: {type: "text"},
	"location"		: {type: "text"},
	"type"			: {type: "text"},
};

var stmt = "create table if not exists calendar (";
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

var insert_stmt = "INSERT INTO calendar values(";

var idx = 0;
for (var propName in exports._properties) {
	var property = exports._properties[propName];
	if (idx++ != 0) insert_stmt +=", ";
	insert_stmt += "$" + propName;
}

insert_stmt += ")";

exports._INSERT_ENTRY_STMT = insert_stmt;