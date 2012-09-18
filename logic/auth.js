var users = require("logic/models/users"),
	crypto = require('crypto');

module.exports = {
	authenticate: function(options, callback) {
		if (options.ignorePassword) {
			users.getByUsername(
				options.username, 
				function(error, user) {
					callback(error, {
						admin : user.admin ? true : false,
						locked : user.locked ? true : false
					});
				}
			);
		}
		else {
			var filterFn = function(user) {
				return user.username == options.username 
					&& user.password == options.password;
			};
			users.getFiltered(filterFn, function(error, results) {
				if (error || results.length != 1 || results[0].locked) {
					callback(error, {authenticated : false});
				}
				else {
					var user = results[0];
					callback(null, {
						authenticated : true,
						admin : user.admin,
						locked : user.locked
					});
				}
			});
		}
	},

	hash : function(string) {
		var key = "ikstymfirstkey001",
			salt = "2265256663453634667346",
			signer = crypto.createHmac('sha512', new Buffer(key, 'utf-8'));
		return signer.update(string + salt).digest("hex");
	}
};
