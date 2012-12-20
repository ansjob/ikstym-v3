/**
 * Module dependencies.
 */

var express = require('express')
	, routes = require('./routes')
	, http = require('http')
	, path = require('path')
	, auth = require('./logic/auth')
	, repl = require('repl')
	, dbLib = require('./logic/db.js')
	, users = require('./logic/models/users');

var app = express();

dbLib.runInitQueries();

global.app = app;
global.users = users;
global.routes = routes;
global.auth = auth;

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


for (var idx = 0; idx < routes.mappings.length; idx++)
{
	var mapping = routes.mappings[idx];
	switch(mapping.method) 
	{
		case "get":
			app.get(mapping.route, mapping.callback);
		break;
		case "post":
			app.post(mapping.route, mapping.callback);
		break;
		case "put":
			app.put(mapping.route, mapping.callback);
		break;
		case "delete":
			app.delete(mapping.route, mapping.callback); 
		break;
	}
}

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
	var cli = 	repl.start({
		"prompt"			: "Stym > ",
		"useGlobal"			: true,
		"terminal"			: true,
		"useColors"			: true,
		"ignoreUndefined"	: true
	});

	cli.on('exit', function() {
		console.log("\nExiting IK Stym V3");
		process.exit();
	});
});


