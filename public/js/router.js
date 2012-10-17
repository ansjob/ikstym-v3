define(
	["backbone",
		"jquery",
		"views/login-page",
		"views/start-page",
		"views/error_dialog"
	]
	,function(
		Backbone, $,
		LoginView,
		StartView,
		ErrorDialog) {

	var DEBUGING_ROUTER = true;
	var DEBUG = function(msg) {
		if (DEBUGING_ROUTER) console.log("[ROUTER] " + msg);
	};
	var IKRouter = Backbone.Router.extend({

		initialize: function(options) {
			this.mainRegion = options.mainRegion;
			this.modalRegion = options.modalRegion;
			this.statusRegion = options.statusRegion;
			this.vent = options.vent;
		},

		routes : {
			login		: "gotoLogin",
			''			: "gotoStart",
			'*actions'	: "defaultAction"
		},

		start : function() {
			DEBUG("Starting!");
			Backbone.history.start();
		},

		stop : function() {
			DEBUG("Stopping!");
			Backbone.history.stop();
		},

		gotoLogin : function() {
			DEBUG("Requested to render login page module");
			var view = new LoginView({
				router: this,
				vent : this.vent
			});
			this.clearErrors();
			this.mainRegion.show(view);
		},

		gotoStart: function() {
			DEBUG("Requested to render the start page");
			var view = new StartView();
			this.clearErrors();
			this.mainRegion.show(view);
		},

		defaultAction : function() {
			DEBUG("An illegal route was entered!");
			var errorDialog = new ErrorDialog({
				headline: "Oh no! 404!",
				message : "Länken du klickade på var trasig!" + 
					" Kontakta admin och berätta vad du gjorde" +
					" för att åstadkomma detta tokeri.",
				region : this.modalRegion
			});
			errorDialog.show();
		},

		clearErrors : function() {
			this.modalRegion.reset();
		}

	});

	return IKRouter;
});
