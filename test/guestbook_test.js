nodeunit = require("nodeunit");

var sqlite3 = require("sqlite3").verbose();

var db = new sqlite3.Database(":memory:");
var dbLib = require("logic/db.js");

dbLib.db = db;

var guestbook = require("logic/models/guestbook"),
	users = require("logic/models/users");

var anonSample = {
	text : "Some simple sample",
	alias: "some name",
	timestamp : new Date().getTime(),
	ip: "127.0.0.1",
};

var loggedinSample = {
	text : "Some wicked message",
	timestamp : new Date().getTime(),
	ip : "2001::123:31",
	username : "ansjob"
};

var sampleUser = {
	username: "ansjob",
	password : "hash12345",
	first_name : "Andreas",
	last_name : "Sjöberg",
	email : "ansjob@kth.se",
	phone: 123456,
	nick : "SjöbergArn",
	admin: true,
	locked: false
};

module.exports = {
	setUp: function(callback) {
		dbLib.runInitQueries(function() {
			callback();
		});
	},

	tearDown : function(callback) {
		guestbook.deleteAll(callback);
	},

	testInsertingAnonymous: function(test) {
		test.expect(1);
		guestbook.insert(anonSample, function(error) {
			test.equal(null, error);
			test.done();
		});
	},

	testInsertingAndGettingEntry: function(test) {
		var props = ["text", "alias", "ip", "timestamp"];
		test.expect(props.length + 2);
		guestbook.insert(anonSample, function(error) {
			test.equal(null, error);
			guestbook.getAll(function(error, allEntries) {
				test.equal(null, error);
				var entry = allEntries[0]; //allEntries is either an array or map
				for (var i in props) {
					var prop = props[i];
					test.equal(entry[prop], anonSample[prop]);
				}
				test.done();
			});
		});
	},

	testInsertingAndDeletingEntry : function(test) {
		test.expect(5);
		guestbook.insert(anonSample, function(error) {
			test.equal(null, error);
			guestbook.getAll(function(error2, allEntries) {
				test.equal(null, error2);
				var entry = allEntries[1];
				guestbook.deleteAll(function(error3) {
					test.equal(null, error3);
					guestbook.getAll(function(error4, newEntries) {
						test.equals(null, error4);
						test.equals(undefined, newEntries[1]);
						test.done();
					});
				});
			});
		});
	},

	testInsertingTwoEntries: function(test) {

		var props = ["text", "alias", "ip", "timestamp"];
		test.expect(2 + 2*props.length);
		var runTest = function() {
			guestbook.getAll(function(error, all) {
				test.equals(null, error);
				test.equals(2, Object.keys(all).length);
				for (var key in all) {
					var entry = all[key];
					for (var i in props) {
						var prop = props[i];
						test.equals(anonSample[prop], entry[prop]);
					}
				}
				test.done();
			});
		};

		var callbacks = 0;
		var cb = function() {
			if (++callbacks == 2) {
				runTest();
			}
		}
		guestbook.insert(anonSample, cb);
		guestbook.insert(anonSample, cb);
	},


	testsUsingUsers : {

		setUp: function(callback) {
			users.insert(sampleUser, callback);
		},

		tearDown : function(callback) {
			users.deleteAll(callback);
		},

		testInsertingWithUsername : function(test) {
			test.expect(4);
			guestbook.insert(loggedinSample, function(error) {
				test.equals(null, error);
				guestbook.getAll(function(error, all) {
					test.equals(null, error);
					var entry = all[0];
					test.equal(undefined, entry.alias);
					test.deepEqual(sampleUser, entry.userdata);
					test.done();
				});
			});
		},

		deletingEntry : function(test) {
			test.expect(3);
			var runTest = function() {
				guestbook.deleteEntry(1, function(error) {
					test.equals(null, error);
					guestbook.getFiltered(function(entry) { return entry.id == 1;},
						function(error2, filtered) {
							test.equals(null, error2);
							test.equals(0, filtered.length);
							test.done();
					});
				});
			};
			var inserted = 0;
			var cb = function() {
				if (++inserted == 2) {
					runTest();
				}
			}
			guestbook.insert(loggedinSample, cb);
			guestbook.insert(loggedinSample, cb);
		}
 
	},

	paginationTests: {

		setUp : function(cb) {
			this.test_size = 1337;
			var tests = [];
			var pending = 0;
			var done_issuing = false;
			var insert = function(idx, entry) {
				pending++;
				guestbook.insert(entry, function(err) {
					if(err) {
					}
					if (--pending == 0 && done_issuing) {
						cb();
					}
				});
			};
			for (var i = 0; i < this.test_size; ++i) {
				tests[i] = {};
				for (var key in anonSample) {
					tests[i][key] = anonSample[key];
				}
				insert(i, tests[i]);
			}
			done_issuing = true;
		},

		testAllEntered : function(test) {
			var expected = this.test_size;
			test.expect(2);
			guestbook.getAll(function(err, entries) {
				test.equals(null, err);
				test.equals(expected, entries.length);
				test.done();
			});
		},

		testGettingFirstPageIsRightSize : function(test) {
			test.expect(1);
			guestbook.getPage(0, function(err, entries) {
				test.equals(20, entries.length);
				test.done();
			});
		},

		testGettingFirstPageIsNewest : function(test) {
			test.expect(1);
			var test_size = this.test_size;
			guestbook.getPage(0, function(err, entries) {
				test.equals(test_size, entries[0].id);
				test.done();
			});
		}

	}

};
