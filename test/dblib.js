var nodeunit = require("nodeunit");

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(":memory:");
var dbLib = require("logic/db.js");

dbLib.db = db;

var sampleEntity = {
	"id" 		: {type: "integer", primaryKey: true},
	"message"	: {type: "text"}
};

var fkSample = {
	"id"		: {type: "integer", primaryKey: true},
	"foo_id"	: {type: "integer", primaryKey: true, foreignKey: "foo(id)"},
	"note"	: {type: "text"}
};

module.exports = {
	testSimpleCreationStatement : function(test) {
		var expected = "create table if not exists foo( id integer, message text, primary key( id ))";
		var actual = dbLib.creationStatement("foo", sampleEntity);
		test.equals(actual, expected);
		test.done();
	},

	testForeignKeyCreationStatement : function(test) {
		var expected = "create table if not exists bar( id integer, foo_id integer, note text, primary key( id, foo_id ) , foreign key(foo_id) references foo(id))";
		var actual = dbLib.creationStatement("bar", fkSample);
		test.equals(actual, expected);
		test.done();
	},

	testSimpleInsertionStatement : function(test) {
		var expected = "insert into foo values ( $id, $message )",
			actual = dbLib.insertStatement("foo", sampleEntity);
		test.equals(actual, expected);
		test.done();
	}
};
