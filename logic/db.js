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

