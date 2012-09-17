define(
	["backbone",
		"jquery",
		"views/login-page"]
	,function(
		Backbone, $,
		LoginView) {

	var DEBUGING_ROUTER = true;
	var DEBUG = function(msg) {
		if (DEBUGING_ROUTER) console.log("[ROUTER] " + msg);
	};
	var IKRouter = Backbone.Router.extend({

		routes : {
			login : "gotoLogin",
		},

		start : function() {
			DEBUG("Starting!");
			Backbone.history.start();
		},

		gotoLogin : function() {
			DEBUG("Requested to render login page module");
			
		}
	});

	return IKRouter;
});
