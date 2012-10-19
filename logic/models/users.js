var dbLib = require('logic/db.js');

var db = dbLib.db;

module.exports = {
	getAllUsers : function(callback) {
		this.getFiltered(function() {return true;}, callback);
	},

	insert: function(user, callback) {
		var sqlParams = {};
		for (var propName in exports._properties) {
			var property = exports._properties[propName];
			sqlParams["$" + propName] = user[propName];
		}
		db.run(exports._INSERT_USER_STMT, 
			sqlParams, callback);
	},

	getByUsername : function(username, callback) {
		var filterFn = function(user) {
			return user.username == username;
		};
		this.getFiltered(filterFn, function(error, lst) {
			if (error) {
				callback(error, undefined);
				return;
			}
			if (lst.length != 1) {
				error = "Error fetching user with username == " + username;
			}
			callback(error, lst[0]);
		});
	},

	getFiltered : function(filterFn, callback) {
		db.all("select * from user", function(error, users) {
			var filteredResults = [];
			for (idx in users) {
				if (filterFn(users[idx])){
					var user = users[idx];
					for (var field in user) {
						if (exports._properties[field].type == "boolean") {
							user[field] = user[field] ? true : false;
						}
					}
					filteredResults.push(users[idx]);
				}
			}
			callback(error,filteredResults);
		});
	},

	deleteAll : function(callback) {
		db.run("delete from user",callback); 
	},

	update : function(user, callback) {
		var err = this.validate(user);
		if (err) {
			callback(err);
			return;
		}
		var updateArgs = {};
		for (var idx in user) {
			updateArgs["$" + idx] = user[idx];
		}
		db.run(exports._UPDATE_USER_STMT, updateArgs, callback);
	},

	delete : function(username, callback) {
		db.run(exports._DELETE_USER_STMT, {$username : username}, callback);
	},

	validate : function(user) {
		for (var propName in exports._properties) {
			if (user[propName] == undefined) {
				return propName + " is undefined!";
			}
		}
		if (user.email.search(exports._EMAIL_REGEX) == -1) {
			return "Invalid email address";
		}
	}
};

exports._properties = {
	"username":		{type: "string", primaryKey: true},
	"password":		{type: "string"},
	"first_name":	{type: "string"},
	"last_name":	{type: "string"},
	"email":		{type: "string"},
	"phone":		{type: "string"},
	"nick":			{type: "string"},
	"admin":		{type: "boolean"},
	"locked":		{type: "boolean"}
};


var stmt = "create table if not exists user (";
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

stmt = "update user set ";
idx = 0;
for (var propName in exports._properties) {
	if (idx++ != 0)
		stmt += ", ";
	stmt += propName + " = $" + propName;
}

stmt += " where username = $username";

exports._UPDATE_USER_STMT = stmt;

stmt = "INSERT INTO user values (";

idx = 0;
for (var propName in exports._properties) {
	var property = exports._properties[propName];
	if (idx++ != 0) stmt += ", ";
	stmt += "$" + propName;
}

stmt += ")";

exports._INSERT_USER_STMT = stmt;

exports._GET_SINGLE_USER_STMT = "SELECT * FROM user where username = $username";

exports._GET_ALL_USERS_STMT = "SELECT * FROM user";

exports._DELETE_USER_STMT = "DELETE from user where username = $username";

exports._EMAIL_REGEX = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
