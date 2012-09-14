var nodeunit = require('nodeunit');

var users = require("../logic/models/users");

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

var testUser = {
	username: "ansjob",
	password: "test123",
	email: "ansjob@test.se",
	phone: "123456",
	nick: "Sjöberg",
	admin: true
};

var testUser2 = {
	username: "testuser",
	password: "test123",
	email: "test@test.se",
	phone: "1234567",
	nick: "Testarn",
	admin: false
};


module.exports = {
	setUp: function(callback) {
		this.DAO = users.DAO(db);
		this.setup = true;
		db.run(users.tableCreationStmt, function() {
			callback();
		});
	},

	tearDown: function(callback) {
		this.setup = false;
		this.DAO.deleteAll(function() {
			callback();
		});
	},

	testThereAreNoInitialUsers: function(test) {
		test.expect(1);
		this.DAO.getAllUsers(function(allUsers) {
			test.equals(allUsers.length , 0);
			test.done();
		});
	},

	testInsertingOneUser : function(test) {
		test.expect(1);
				var DAO = this.DAO;
		DAO.insert(testUser, function(err) {
			if (err) throw err;
			DAO.getByUsername("ansjob", function(fromDb, error) {
				test.deepEqual(fromDb, testUser);
				test.done();
			});
		});
	},

	testGettingInvalidUser: function(test) {
		this.DAO.getByUsername("nonexisting", function(fromDb, error) {
			test.equal(undefined, fromDb);
			test.done();
		});
	},

	'TwoUsersScenarios' : {
		setUp: function(callback) {
			var inserted = 0;
			var myCallback = function() {
				if (++inserted == 2) {
					callback();
				}
			};
			this.DAO.insert(testUser, myCallback);
			this.DAO.insert(testUser2, myCallback);
		},
		tearDown: function(callback) {
			this.DAO.deleteAll(function() {
				callback();
			});
		},

		testFilterFunction: function(test) {
			test.expect(2);
			this.DAO.getFiltered(
				function(user) {
					return user.username.charAt(0) == "a" ;
				},
				function(results) {
					test.equal(1, results.length);
				}
			);

			this.DAO.getFiltered(
				function(user) {
					return user.username.charAt(0) == "b" ;
				},
				function(results) {
					test.equal(0, results.length);
				}
			);

			test.done();
		},

		testGetByName : function(test) {
			test.expect(1);
			this.DAO.getByUsername("testuser", function(user) {
				test.deepEqual(testUser2, user);
				test.done();
			});
		},

		testGetAllFunction: function(test) {
			test.expect(1);
			this.DAO.getAllUsers(function(users) {
				test.equals(2, users.length);
				test.done();
			});
		},

		testUpdatingUserWithValidContents: function (test) {
			test.expect(1);
			var DAO = this.DAO;
			DAO.getByUsername("ansjob", function(me) {
				me.email = "ansjob@kth.se";
				DAO.update(me, function(err) {
					if (!err) {
						DAO.getByUsername("ansjob", function(freshFromDb) {
							test.deepEqual(me, freshFromDb);
							test.done();
						});
					}
				});
			});
		},

		testUpdatingUserWithNoUsername: function(test) {
			test.expect(1);
			var DAO = this.DAO;
			DAO.getByUsername("ansjob", function(me) {
				me.username = undefined;
				DAO.update(me, function(err) {
					if (err) {
						test.ok(true, "error was set");
						test.done();
					}else {
						test.ok(false, "should have an error set");
						test.done();
					}
				});
			});
		},

		testUpdatingUserWithInvalidEmail : function(test) {
			test.expect(1);
			var DAO = this.DAO;
			DAO.getByUsername("ansjob", function(me) {
				me.email = "@test.se";
				DAO.update(me, function(err) {
					if (err) {
						test.ok(true, "error was set");
						test.done();
					}else {
						test.ok(false, "should have an error set");
						test.done();
					}
				});
			});
		}
	}
};
