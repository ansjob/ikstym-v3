
var users = require("../logic/models/users.js");
var auth = require("../logic/auth");
var guestbook = require("../logic/models/guestbook");
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
	},

//Login functionality

	{
		method: "post",
		route : "/api/login",
		callback: function(req, res) {
			var username = req.body.username;
			var hash = req.body.hash;
			auth.authenticate({
				username : username,
				password : hash
			}, function(error, results) {
				if (error) {
					res.status(500).send("Server failed");
				}
				else if (results.authenticated) {
					users.getByUsername(username, function(error, user) {
						delete user.password;
						res.send(user);
					});
				}
				else if (results.locked) {
					res.status(402).send("Kontot är låst!");
				}
				else {
					res.status(401).send("Access denied!");
				}
			});
		}
	},

//Guestbook API
	{
		method: "get",
		route: "/api/guestbook",
		callback : function(req, res) {
			guestbook.getAll(function(error, allEntries) {
				if (error) {
					res.status(500).send(error);
					return;
				}
				for (var id in allEntries) {
					var entry = allEntries[id];
					if (entry.userdata){
						delete entry.userdata.password;
					}
				}
				res.send(allEntries);
			});
		}
	},

//Insert guestbook entry
	{
		method: "post",
		route: "/api/guestbook",
		callback: function(req, res) {

			var entry = {
				time_stamp : new Date().getTime(),
				text : req.body.message,
				ip : req.ip,
			};

			var insert = function() {
				guestbook.insert(entry, function(error) {
					if (error) {
						res.status(500).send(
							"Ett fel uppstod när inlägget skulle sparas!"
						);
					} else {
						res.send("OK");
					}
				});
			};
			if (req.body.username) {
				auth.authenticate({
					username: req.body.username,
					password: req.body.hash
				}, function(error, results) {
					if (error) {
						res.status(500).send("Server failure");
					}
					else if (results.authenticated) {
						entry.username = req.body.username;
						insert();
					}
					else {
						res.status(401).send("Access denied!");
					}
				});
			} else if (req.body.alias) {
				//TODO Sanitize the shit out of this!
				entry.alias = req.body.alias;
				insert();
			}
		}
	}

];
