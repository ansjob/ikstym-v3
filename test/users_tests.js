var nodeunit = require('nodeunit');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
var dbLib = require("logic/db.js");
dbLib.db = db;

var users = require("logic/models/users"),
	auth = require("logic/auth");

var testUser = {
	username: "ansjob",
	password: auth.hash("test123"),
	first_name : "Andreas",
	last_name : "Sjöberg",
	email: "ansjob@test.se",
	phone: "123456",
	nick: "Sjöberg",
	admin: true,
	locked: false
};

var testUser2 = {
	username: "testuser",
	password: auth.hash("test123"),
	first_name : "Test",
	last_name : "Testsson",
	email: "test@test.se",
	phone: "1234567",
	nick: "Testarn",
	admin: false,
	locked: false
};

module.exports = {
	setUp: function(callback) {
		dbLib.runInitQueries(callback);
	},

	tearDown: function(callback) {
		users.deleteAll();
		callback();
	},

	testThereAreNoInitialUsers: function(test) {
		test.expect(2);
		users.getAllUsers(function(error, users) {
			test.equals(error, undefined);
			test.equals(users.length, 0);
			test.done();
		});
	},

	testInsertingAndGettingOneUser : function(test) {
		test.expect(2);
		users.insert(testUser);
		users.getByUsername("ansjob", function(error, me) {
			test.equals(error, undefined);
			test.deepEqual(testUser, me);
			test.done();
		});
	},

	testGettingInvalidUser: function(test) {
		test.expect(1);
		users.getByUsername("nonexisting", function(error, fromDb) {
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
			users.insert(testUser, myCallback);
			users.insert(testUser2, myCallback);
		},
		tearDown: function(callback) {
			users.deleteAll(callback);
		},

		testFilterFunction: function(test) {
			test.expect(2);
			var callbacks = 0;
			var completeTest = function() {
				if (++callbacks == 2) test.done();
			}
			users.getFiltered(
				function(user) {
					return user.username.charAt(0) == "a";
				},
				function(error, filteredUsers) {
					test.equal(1, filteredUsers.length);
					completeTest();
				}
			);

			users.getFiltered(
				function(user) {
					return user.username.charAt(0) == "b" ;
				},
				function(error, noUsers) {
					test.equal(0, noUsers.length);
					completeTest();
				}
			);
		},

		testGetByName : function(test) {
			test.expect(1);
			users.getByUsername("testuser", function(error, user) {
				test.deepEqual(testUser2, user);
				test.done();
			});
		},

		testGetAllFunction: function(test) {
			test.expect(1);
			users.getAllUsers(function(error, users) {
				test.equal(2, users.length);
				test.done();
			});
		},

		testUpdatingUserWithValidContents: function (test) {
			test.expect(5);
			users.getByUsername("ansjob", function(err1, user) {
				test.equals(undefined, err1);
				test.deepEqual(user, testUser);
				user.email = "test.testsson@test.se";
				users.update(user, function(err2) {
					test.equals(undefined, err2);
					users.getByUsername("ansjob", function(err3, fromDb) {
						test.equals(undefined, err3);
						test.deepEqual(user, fromDb);
						test.done();
					});
				});
			});
		},

		testUpdatingUserWithNoUsername: function(test) {
			test.expect(1);
			users.getByUsername("ansjob", function(error, me) {
				me.username = undefined;
				users.update(me, function(err) {
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
			users.getByUsername("ansjob", function(error, me) {
				me.email = "@test.se";
				users.update(me, function(err) {
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

		testDeletingUser: function(test) {
			test.expect(4);
			users.delete("ansjob", function(error) {
				test.equals(undefined, error);
				users.getByUsername("ansjob", function(err, me) {
					test.notEqual(undefined, err);
					users.getAllUsers(function(err2, allUsers) {
						test.equal(undefined, err2);
						test.equal(allUsers.length, 1);
						test.done();
					});
				});
			});
		}

	}

};
