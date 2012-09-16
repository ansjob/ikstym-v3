
var tamejs = require("tamejs");
var users = require("../logic/models/users.js");

exports.mappings = [ 
	{
		method: "get",
		route: "/api/version",
		callback: function(req, res) {
			res.send("3.0.0");
		}
	},

//Users API
	{
		method: "get",
		route : "/api/users",
		callback : function(req, res) {
			users.getAllUsers(function(error, users) {
				if (error) {
					res.status(500).send(error);
				}
				else {
					for (var i in users) {
						var user = users[i];
						delete user.password;
					}
					res.send(users);
				}
			});
		}
	}

];
