define(
	[
		"auth",
		"backbone",
		"underscore",
		"views/login-page",
		"views/start-page",
		"views/error_dialog",
		"views/guestbook-page",
		"views/calendar"
	]
	,function(
		Auth,
		Backbone, _,
		LoginView,
		StartView,
		ErrorDialog,
		Guestbook,
		CalendarView) {

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
			guestbook	: "gotoGuestbook",
			calendar	: "gotoCalendar",
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
			Auth.clearData();
			this.vent.trigger("logout");
			this.gotoStart();
		},

		gotoGuestbook : function() {
			var view = new Guestbook();
			this.clearErrors();
			this.mainRegion.show(view);
		},

		gotoCalendar : function() {
			var view = new CalendarView();
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
