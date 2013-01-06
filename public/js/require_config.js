define([], function() {
	require.config({
		baseUrl : "js",
		paths : {
			"bootstrap" 			: "lib/bootstrap/bootstrap",
			"backbone"				: "lib/backbone-min",
			"underscore"			: "lib/underscore-min",
			"marionette"			: "lib/backbone.marionette",
			"text"					: "lib/text",
			"jquery"				: "lib/jquery-1.8.0.min",
			"order"					: "lib/order",
			"backbone.paginator"	: "lib/backbone.paginator.min",
			"jquery.cookies"		: "lib/jquery.cookie",
			"jquery.calendar"		: "lib/fullcalendar"
		},
		shim : {
			'backbone' : {
				deps : ["underscore"],
				exports : 'Backbone'
			},
			'jquery.cookies' : {
				deps : ["jquery"],
				exports : "$"
			},
			'jquery.calendar' : {
				deps : ["jquery"],
				exports : "$"
			}
		}
	});
});
