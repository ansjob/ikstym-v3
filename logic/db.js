var sqlite3 = require('sqlite3').verbose();

exports.db = new sqlite3.Database("ikstym.db");

exports.initQueries = [];

exports.runInitQueries = function(callback) {
	//Special case:
	if (exports.initQueries.length == 0) callback();

	var numCompleted = 0;
	var onCompletion = function() {
		if (++numCompleted == exports.initQueries.length)
			if(callback) callback();
	};
	for (var idx in exports.initQueries) {
		var sql = exports.initQueries[idx];
		exports.db.run(sql, onCompletion);
	};
};

exports.creationStatement = function(tableName, properties) {
	var stmt = "create table if not exists " + tableName + "( ";
	var idx = 0;
	var foreignKeys = [];
	var primaryKey = [];
	for (var propName in properties) {
		var property = properties[propName];
		if (idx != 0) stmt += ", ";
		stmt += propName + " " + property.type;
		if (property.primaryKey) primaryKey.push(propName);
		if (property.foreignKey) foreignKeys.push({
			propName : propName,
			reference : property.foreignKey}
		);
		idx++;
	}

	if (primaryKey.length > 0)
		stmt += ", primary key(";
	for (var i = 0; i < primaryKey.length; ++i) {
		if (i != 0) stmt += ",";
		stmt += " " + primaryKey[i];
	}

	if (primaryKey.length > 0)
		stmt += " )";

	for (var i = 0; i < foreignKeys.length; ++i) {
		var key = foreignKeys[i];
		stmt += " , foreign key(" + key.propName + ") " +
			"references " + key.reference;
	}

	return stmt + ")";
}

exports.insertStatement = function(tableName, properties) {
	var stmt = "insert into " + tableName + " values (";
	var idx = 0;
	for (var propertyName in properties) {
		if (idx != 0) stmt += ",";
		stmt += " $" + propertyName;
		idx++;
	}
	return stmt + " )";
};

