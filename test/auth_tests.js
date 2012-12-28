var nodeunit = require('nodeunit');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
var dbLib = require('logic/db.js');

dbLib.db = db;

var users = require("logic/models/users");
var auth = require("logic/auth");

var testUser = {
	username: "ansjob",
	password: auth.hash("test123"),
	email: "ansjob@test.se",
	phone: "123456",
	nick: "Sjöberg",
	admin: true,
	locked: false
};

var testUser2 = {
	username: "testuser",
	password: auth.hash("test123"),
	email: "test@test.se",
	phone: "1234567",
	nick: "Testarn",
	admin: false,
	locked: false
};

var testUser3 = {
	username: "oldadmin",
	password: "test123",
	email: "test@test.se",
	phone: "1234567",
	nick: "Testarn",
	admin: true,
	locked: true
};


module.exports = {
	setUp: function(callback) {
		var insertsCompleted = 0;
		var insertCallback = function(error) {
			if (error) throw error;
			if (++insertsCompleted == 3) callback();
		};
		dbLib.runInitQueries(function() {
			users.insert(testUser, insertCallback);
			users.insert(testUser2, insertCallback);
			users.insert(testUser3, insertCallback);
		});
	},

	tearDown : function(callback) {
		users.deleteAll(callback);
	},

	testGettingIgnoringPassword : function(test) {
		test.expect(3);
		auth.authenticate(
			{username: "ansjob", ignorePassword : true }
			, function(error, result) {
			test.equal(null, error);
			test.equal(true, result.admin);
			test.equal(false, result.locked);
			test.done();
		});
	},

	testGettingWithPassword : function(test) {
		test.expect(4);
		auth.authenticate(
			{username: "ansjob", password : auth.hash("test123")}, function(error, result) {
				test.equal(null, error);
				test.equal(true, result.authenticated);
				test.equal(true, result.admin);
				test.equal(false, result.locked);
				test.done();
			});
	},

	testIgnoringCase : function(test) {
		test.expect(2);
		auth.authenticate({username: "aNsJoB", password: auth.hash("test123")},
			function(error, result) {
				test.equal(null, error);
				test.equal(true, result.authenticated);
				test.done();
		});
	},

	testGettingWithWrongPassword : function(test) {
		test.expect(2);
		auth.authenticate({username : "ansjob", password: auth.hash("__WRONG__")},
			function(error, result) {
				test.equal(null, error);
				test.deepEqual({authenticated : false}, result);
				test.done();
			});
	},

	testGettingLockedUserWithCorrectPassword : function(test) {
		test.expect(2);
		auth.authenticate({username : "oldadmin", password : "test123"},
			function(error, result) {
				test.equal(null, error);
				test.deepEqual({authenticated : false}, result);
				test.done();
			});
	},

	testHashIsCompatibleWithOldSite : function(test) {
		var expected = "09dd1a43acf7a4a9fabec9f3bb1483f01c7bd3acab2c5dcf041d6ce007e7275d69453a4232516466791ac333cc3bf75efad42551fe3e785d34e16295e35672bc";
		var actual = auth.hash("test123");
		test.equal(expected, actual);
		test.done();
	},

	testAuthenticatingGETRequest : function(test) {
		test.expect(4);
		var request = {
			query : {
				username : "ansjob",
				password : auth.hash("test123")
			}
		};
		auth.authenticate({ req : request},
			function(error, results) {
				test.equal(null, error);
				test.equal(true, results.authenticated);
				test.equal(true, results.admin);
				test.equal(false, results.locked);
				test.done();
			}
		);
	},

	testAuthenticatingGETRequestUsingCookies : function(test) {
		var request = {
			query : {
				foo : "bar",
				xyz : 123
			},
			cookies : {
				username : "ansjob",
				password : auth.hash("test123")
			}
		};
		test.expect(4);
		auth.authenticate({ req : request},
			function(error, results) {
				test.equal(null, error);
				test.equal(true, results.authenticated);
				test.equal(true, results.admin);
				test.equal(false, results.locked);
				test.done();
			}
		);

	}

};
