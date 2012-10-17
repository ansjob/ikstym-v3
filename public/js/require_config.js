define([], function() {
	require.config({
		baseUrl : "js",
		paths : {
			"jquery"		: "lib/jquery-1.8.0.min",
			"bootstrap" 	: "lib/bootstrap/bootstrap",
			"backbone"		: "lib/backbone-min",
			"underscore"	: "lib/underscore-min",
			"marionette"	: "lib/backbone.marionette",
			"text"			: "lib/text",
			"order"			: "lib/order"
		},
		shim : {
			'backbone' : {
				deps : ["underscore", "jquery"],
				exports : 'Backbone'
			}
		}
	});
});
