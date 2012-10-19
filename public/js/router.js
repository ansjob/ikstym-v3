define(
	[
		"backbone",
		"underscore",
		"views/login-page",
		"views/start-page",
		"views/error_dialog"
	]
	,function(
		Backbone, _,
		LoginView,
		StartView,
		ErrorDialog) {

	var DEBUGING_ROUTER = false;
	var DEBUG = function(msg) {
		if (DEBUGING_ROUTER) console.log("[ROUTER] " + msg);
	};
	var IKRouter = Backbone.Router.extend({

		initialize: function(options) {
			_.bindAll(this);
			this.mainRegion = options.mainRegion;
			this.modalRegion = options.modalRegion;
			this.statusRegion = options.statusRegion;
			this.vent = options.vent;
			this.registerEvents();
		},

		registerEvents : function() {
			var that = this;
			this.vent.on("login:success", function() {
				that.navigate("", true);
			});
		},

		routes : {
			login		: "gotoLogin",
			logout		: "logoutGotoStart",
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

		logoutGotoStart: function() {
			localStorage.removeItem("userdata");
			this.vent.trigger("logout");
			this.gotoStart();
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
			this.clearErrors();
			errorDialog.show();
		},

		clearErrors : function() {
			DEBUG("Removing error messages!");
			this.modalRegion.reset();
		}

	});

	return IKRouter;
});
