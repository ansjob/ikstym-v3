var utils = require("../logic/utils.js");
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
						res.cookie("username", user.username, {maxAge : 1000*60*60*48});
						res.cookie("password", user.password, {maxAge : 1000*60*60*48});
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

			auth.authenticate({req : req}, function(error, results) {
				if(error) {
					res.status(500).send("Ett fel uppstod vid säkerhetskoll för att hämta gästboksinlägg");
					return;
				}

				var page = parseInt(req.query.page) || 0;
				guestbook.getPage(page, function(error, allEntries) {
					if (error) {
						res.status(500).send(error);
						return;
					}
					for (var id in allEntries) {
						var entry = allEntries[id];
						if(! (results.authenticated && results.admin) ) delete entry.ip;
						if (entry.userdata){
							delete entry.userdata.password;
						}
					}
					res.send(allEntries);
				});
			});

		}
	},

//Insert guestbook entry
	{
		method: "post",
		route: "/api/guestbook",
		callback: function(req, res) {

			var entry = {
				timestamp : new Date().getTime(),
				text : utils.escape_html(req.body.message),
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
			if (req.body.username || req.cookies) {
				auth.authenticate({
					req : req
				}, function(error, results) {
					if (error) {
						res.status(500).send("Server failure");
					}
					else if (results.authenticated && results.admin && !results.locked) {
						entry.username = results.user.username;
						insert();
					}
					else {
						res.status(401).send("Du har inte tillåtelse att göra detta");
					}
				});
			} else if (req.body.alias) {
				entry.alias = utils.escape_html(req.body.alias);
				insert();
			}
		}
	},

//Delete guestbook entry
	{
		method: "delete",
		route: "/api/guestbook/:id?",
		callback : function(req, res) {
			console.log
			if (req.route.params.id) {
				auth.authenticate({
					req : req
				},
				function(error, results) {
					if (error) {
						res.status(500).send("Servern misslyckades: " + error);
					}
					else if (results.authenticated && results.admin) {
						guestbook.deleteEntry(req.route.params.id, function(delError) {
							if (delError) {
								res.status(500).send("Servern misslyckades: " + delError);
							}
							else {
								res.send("{}");
							}
						});
					}
					else {
						res.status(401).send("Access denied");
					}
				});
			} else {
				res.status(400).send("Inget ID angett");
			}
		}
	}

];
