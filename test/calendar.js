nodeunit = require("nodeunit");

var sqlite3 = require("sqlite3").verbose();

var db = new sqlite3.Database(":memory:");
var dbLib = require("logic/db.js");

dbLib.db = db;

var calendar = require("logic/models/calendar"),
	users = require("logic/models/users");

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

var sampleEvent = {
	start : new Date().getTime(),
	end : new Date().getTime() + 1000,
	title : "Foo Event",
	description : "Some test event we are using",
	location : "Somewhere over the rainbow",
	type : "TEST"
};

var sampleRSVP = {
	event_id : 1,
	username : "ansjob",
	attending : true,
	comment : "Foo comment",
	guests : 3,
	timestamp : new Date().getTime()
};


module.exports = {
	setUp : function(cb) {
		dbLib.runInitQueries(cb);
	},

	tearDown : function(cb) {
		calendar.deleteAll(cb);
	},

	testZeroExistInitially : function(test) {
		test.expect(1);
		calendar.getAll({}, function(error, entries) {
			test.equals(0, entries.length);
			test.done();
		});
	},

	withOneEventInserted : {
		setUp : function(cb) {
			calendar.insert(sampleEvent, cb);
		},

		testOneIsInserted : function(test) {
			test.expect(6 + 3);
			var getAllOpts = {};
			calendar.getAll(getAllOpts, function(error, entries) {
				test.equals(null, error);
				test.equals(entries.length, 1);
				for (var key in sampleEvent) {
					test.equals(sampleEvent[key], entries[0][key]);
				}
				test.equals(1, entries[0].id);
				test.done();
			});
		},

		testGettingHistoric : function(test) {
			test.expect(2);
			calendar.getTimeInterval({
				from : new Date().getTime() - 1000,
				to : new Date().getTime() + 1000
			}, function(error, events) {
				test.equals(null, error);
				test.equals(1, events.length);
				test.done();
			});
		},

		testEntryDoesNotComeOnOldInterval : function(test) {
			test.expect(2);
			calendar.getTimeInterval({
				from : new Date().getTime() - 5000,
				to : new Date().getTime() - 4000
			}, function(error, events) {
				test.equals(null, error);
				test.equals(0, events.length);
				test.done();
			});
		},

		withRSVP : {

			setUp : function(cb) {
				calendar.rsvp.insert(sampleRSVP, cb);
			},

			testGettingRSVP : function(test) {
				test.expect(3);
				calendar.rsvp.search({
					event_id : 1
				}, function(error, entries) {
					test.equals(null, error);
					test.equals(1, entries.length);
					test.deepEqual(sampleRSVP, entries[0]);
					test.done();
				});
			}
		} 
	},

};
