
exports.DAO = function(db) {
	return {

		getAllUsers : function(callback) {
			this.getFiltered(function() {return true;}, callback);
		},

		insert: function(user, callback) {
			var sqlParams = {};
			for (var i in properties) {
				var property = properties[i];
				sqlParams["$" + property.name] = user[property.name];
			}
			db.run(INSERT_USER_STMT, 
				sqlParams,
				function (err){
					callback(err);
				}
			);
		},

		getByUsername : function(username, callback) {
			db.get(GET_SINGLE_USER_STMT, {$username: username},
				function(err, row) {
					if (err) {
						callback(undefined, err);
						return;
					}
					callback(row);
				});
		},

		getFiltered : function(filterFn, callback) {
			db.all(GET_ALL_USERS_STMT, function(err, result) {
				if (err) callback(undefined, err);
				var filteredUsers = [];
				for (var idx in result) {
					if (filterFn(result[idx])) {
						filteredUsers.push(result[idx]);
					}
				}
				callback(filteredUsers, undefined);
			});
		},

		deleteAll : function(callback) {
			db.run(DELETE_ALL_USERS_STMT,callback); 
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
			db.run(UPDATE_USER_STMT, updateArgs, callback);
		},

		validate : function(user) {
			for (var i = 0; i < properties.length; ++i) {
				var prop = properties[i];
				if (user[prop.name] == undefined) {
					return prop.name + " is undefined!";
				}
			}
			if (user.email.search(EMAIL_REGEX) == -1) {
				return "Invalid email address";
			}
		}

	};
};

var properties = [
	{name: "username",	type: "string", primaryKey: true},
	{name: "password",	type: "string"},
	{name: "email",		type: "string"},
	{name: "phone",		type: "string"},
	{name: "nick",		type: "string"},
	{name: "admin",		type: "boolean"}
];


var stmt = "create table if not exists user (";
for (var idx = 0; idx < properties.length; ++idx) {
	var prop = properties[idx];
	if (idx != 0) stmt +=", ";
	stmt += prop.name + " " + prop.type;
	if (prop.primaryKey) stmt += " primary key ";
};
stmt += ")";

exports.tableCreationStmt = stmt;

stmt = "update user set ";
for (var i = 0; i < properties.length; ++i) {
	var property = properties[i];
	if (i != 0)
		stmt += ", ";
	stmt += "{{name}} = ${{name}}".replace(/\{\{name\}\}/g, property.name);
}

stmt += " where username = $username";

var UPDATE_USER_STMT = stmt;

var INSERT_USER_STMT = "INSERT INTO user values ($username, $password, $email, $phone, $nick, $admin)";

var GET_SINGLE_USER_STMT = "SELECT * FROM user where username = $username";

var GET_ALL_USERS_STMT = "SELECT * FROM user";

var DELETE_ALL_USERS_STMT = "DELETE FROM user WHERE 1=1";

var EMAIL_REGEX = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
